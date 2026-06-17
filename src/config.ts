import { homedir } from "node:os";
import { join } from "node:path";
import {
  chmodSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";

export const MCP_URL = process.env.HEYDECKS_MCP_URL ?? "https://heydecks.com/mcp";
export const DASHBOARD_TOKEN_URL = "https://heydecks.com/dashboard/mcp";

const CONFIG_DIR = join(homedir(), ".heydecks");
export const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export interface HeydecksConfig {
  token?: string;
}

export function loadConfig(): HeydecksConfig {
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf8")) as HeydecksConfig;
  } catch {
    return {};
  }
}

export function saveConfig(config: HeydecksConfig): void {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n");
  // Best-effort: keep the token file private.
  try {
    chmodSync(CONFIG_FILE, 0o600);
  } catch {
    /* non-POSIX filesystems */
  }
}

/** Token precedence: HEYDECKS_TOKEN env var, then the saved config file. */
export function getToken(): string | undefined {
  return process.env.HEYDECKS_TOKEN ?? loadConfig().token;
}

export function setToken(token: string): void {
  const config = loadConfig();
  config.token = token;
  saveConfig(config);
}
