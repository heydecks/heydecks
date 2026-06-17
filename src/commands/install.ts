import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir, platform } from "node:os";
import { dirname, join } from "node:path";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { DASHBOARD_TOKEN_URL, getToken } from "../config.js";
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

function configPath(host: Host): string | null {
  const home = homedir();
  const os = platform();
  if (host === "claude") {
    if (os === "darwin")
      return join(home, "Library", "Application Support", "Claude", "claude_desktop_config.json");
    if (os === "win32")
      return join(process.env.APPDATA ?? join(home, "AppData", "Roaming"), "Claude", "claude_desktop_config.json");
    return join(home, ".config", "Claude", "claude_desktop_config.json");
  }
  if (host === "cursor") return join(home, ".cursor", "mcp.json");
  return null; // claude-code uses its own CLI
}

function readJson(path: string): HostConfigFile {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as HostConfigFile;
  } catch {
    return {};
  }
}

function serverEntry(token: string | undefined) {
  return {
    command: "npx",
    args: ["-y", "heydecks", "mcp"],
    ...(token ? { env: { HEYDECKS_TOKEN: token } } : {}),
  };
}

/**
 * Configure one host. `forced` is true when the user named a single host, so
 * we set it up even if it is not detected; otherwise (install-all) we skip
 * hosts that are not present rather than leaving stray config files.
 */
function installOne(host: Host, token: string | undefined, forced: boolean): string {
  if (host === "claude-code") {
    const a = ["mcp", "add", "heydecks"];
    if (token) a.push("-e", `HEYDECKS_TOKEN=${token}`);
    a.push("--", "npx", "-y", "heydecks", "mcp");
    const res = spawnSync("claude", a, { stdio: "ignore" });
    if (res.error || res.status !== 0) {
      return forced
        ? "claude-code  run: claude mcp add heydecks -- npx -y heydecks mcp"
        : "claude-code  not detected, skipped";
    }
    return "claude-code  added via the claude CLI";
  }

  const path = configPath(host);
  if (!path) return `${host}  unsupported`;
  if (!forced && !existsSync(dirname(path))) {
    return `${host.padEnd(11)}  not detected, skipped`;
  }

  const config = readJson(path);
  config.mcpServers = config.mcpServers ?? {};
  config.mcpServers.heydecks = serverEntry(token);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(config, null, 2) + "\n");
  return `${host.padEnd(11)}  ${path}`;
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
 * `heydecks install` with no host (or `all`) configures every host it can find.
 * `heydecks install <host>` targets one. Either way it offers to add the skills.
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
      : `\nDone. No token yet: run "heydecks login" or get one at ${DASHBOARD_TOKEN_URL}\n`,
  );

  await maybeAddSkills(args);
}
