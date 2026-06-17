import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir, platform } from "node:os";
import { dirname, join } from "node:path";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { DASHBOARD_TOKEN_URL, getToken, MCP_URL } from "../config.js";
import { addSkills } from "./skills.js";

type Host = "claude" | "claude-code" | "cursor";
const ALL_HOSTS: Host[] = ["claude", "claude-code", "cursor"];

interface HostConfigFile {
  mcpServers?: Record<string, unknown>;
  [key: string]: unknown;
}

function out(text: string): void {
  process.stdout.write(text);
}

function flagValue(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

function readJson(path: string): HostConfigFile {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as HostConfigFile;
  } catch {
    return {};
  }
}

function writeServer(path: string, entry: unknown): void {
  const config = readJson(path);
  config.mcpServers = config.mcpServers ?? {};
  config.mcpServers.heydecks = entry;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(config, null, 2) + "\n");
}

function cursorPath(): string {
  return join(homedir(), ".cursor", "mcp.json");
}

function claudeDesktopPath(): string {
  const home = homedir();
  const os = platform();
  if (os === "darwin")
    return join(home, "Library", "Application Support", "Claude", "claude_desktop_config.json");
  if (os === "win32")
    return join(process.env.APPDATA ?? join(home, "AppData", "Roaming"), "Claude", "claude_desktop_config.json");
  return join(home, ".config", "Claude", "claude_desktop_config.json");
}

/**
 * Configure one host. OAuth is the default: the host (or mcp-remote) signs in
 * to heydecks in the browser, no token to paste. `token` switches to the
 * mcp_ Bearer path. `forced` (a single named host) sets it up even if the app
 * is not detected; install-all skips undetected hosts.
 */
function installOne(host: Host, token: string | undefined, forced: boolean): string {
  // Claude Code: native remote HTTP + OAuth via its CLI.
  if (host === "claude-code") {
    const a = ["mcp", "add", "--transport", "http", "heydecks", MCP_URL];
    if (token) a.push("--header", `Authorization: Bearer ${token}`);
    const res = spawnSync("claude", a, { stdio: "ignore" });
    if (res.error || res.status !== 0) {
      return forced
        ? `claude-code  run: claude mcp add --transport http heydecks ${MCP_URL}`
        : "claude-code  not detected, skipped";
    }
    return token ? "claude-code  added (token)" : "claude-code  added (sign in with OAuth)";
  }

  // Cursor: native remote URL. Cursor runs the OAuth browser flow itself.
  if (host === "cursor") {
    const path = cursorPath();
    if (!forced && !existsSync(dirname(path))) return "cursor       not detected, skipped";
    writeServer(
      path,
      token ? { url: MCP_URL, headers: { Authorization: `Bearer ${token}` } } : { url: MCP_URL },
    );
    return `cursor       ${path}${token ? " (token)" : " (OAuth)"}`;
  }

  // Claude Desktop: stdio config. OAuth goes through mcp-remote (it handles the
  // browser sign-in and bridges to the remote server); token uses our connector.
  const path = claudeDesktopPath();
  if (!forced && !existsSync(dirname(path))) return "claude       not detected, skipped";
  writeServer(
    path,
    token
      ? { command: "npx", args: ["-y", "heydecks", "mcp"], env: { HEYDECKS_TOKEN: token } }
      : { command: "npx", args: ["-y", "mcp-remote", MCP_URL] },
  );
  return `claude       ${path}${token ? " (token)" : " (OAuth via mcp-remote)"}`;
}

async function maybeAddSkills(args: string[]): Promise<void> {
  if (args.includes("--no-skills")) return;
  let yes = args.includes("--skills") || args.includes("--yes");
  if (!yes) {
    if (!stdin.isTTY) return; // non-interactive: don't block on a prompt
    const rl = createInterface({ input: stdin, output: stdout });
    const ans = (await rl.question("\nAlso install the heydecks agent skills? [Y/n] "))
      .trim()
      .toLowerCase();
    rl.close();
    yes = ans === "" || ans === "y" || ans === "yes";
  }
  if (yes) {
    out("\n");
    addSkills([]);
  }
}

/**
 * `heydecks install` with no host (or `all`) configures every host it can find;
 * `heydecks install <host>` targets one. OAuth by default, `--token` for the
 * mcp_ token path. Then it offers to add the agent skills.
 */
export async function installHost(hostArg: string | undefined, args: string[]): Promise<void> {
  const token = flagValue(args, "--token") ?? getToken();

  if (hostArg && hostArg !== "all" && !ALL_HOSTS.includes(hostArg as Host)) {
    process.stderr.write(
      `Unknown host "${hostArg}". Try: claude, cursor, claude-code, or all.\n`,
    );
    process.exit(1);
  }

  const single = Boolean(hostArg && hostArg !== "all");
  const targets = single ? [hostArg as Host] : ALL_HOSTS;

  out(single ? "" : "Connecting heydecks to your installed AI hosts...\n\n");
  for (const h of targets) out("  " + installOne(h, token, single) + "\n");

  out(
    token
      ? "\nDone. Restart the app(s) to load the heydecks tools.\n"
      : "\nDone. Restart the app(s); they will open a browser to sign in to heydecks.\n" +
          `Prefer a token instead? Re-run with --token (get one at ${DASHBOARD_TOKEN_URL}).\n`,
  );

  await maybeAddSkills(args);
}
