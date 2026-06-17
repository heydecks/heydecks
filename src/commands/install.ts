import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir, platform } from "node:os";
import { dirname, join } from "node:path";
import { DASHBOARD_TOKEN_URL, getToken } from "../config.js";

type Host = "claude" | "claude-code" | "cursor";

interface HostConfigFile {
  mcpServers?: Record<string, unknown>;
  [key: string]: unknown;
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

export function installHost(hostArg: string | undefined, args: string[]): void {
  const host = (hostArg as Host | undefined) ?? "claude";
  const token = flagValue(args, "--token") ?? getToken();

  if (host === "claude-code") {
    stdout(
      "Add heydecks to Claude Code:\n\n" +
        "  claude mcp add heydecks -- npx -y heydecks mcp\n\n" +
        'Then run "heydecks login" (or set HEYDECKS_TOKEN) so the connector can authenticate.\n',
    );
    return;
  }

  const path = configPath(host);
  if (!path) {
    process.stderr.write(`Unknown host "${host}". Try: claude, claude-code, cursor.\n`);
    process.exit(1);
  }

  const config = readJson(path);
  config.mcpServers = config.mcpServers ?? {};
  config.mcpServers.heydecks = {
    command: "npx",
    args: ["-y", "heydecks", "mcp"],
    ...(token ? { env: { HEYDECKS_TOKEN: token } } : {}),
  };

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(config, null, 2) + "\n");

  stdout(`Added heydecks to ${host} at:\n  ${path}\n`);
  if (token) stdout("Restart the app to load the heydecks tools.\n");
  else stdout(`\nNo token yet. Run "heydecks login" or get one at ${DASHBOARD_TOKEN_URL}\n`);
}

function stdout(text: string): void {
  process.stdout.write(text);
}
