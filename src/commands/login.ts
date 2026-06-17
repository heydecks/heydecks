import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { DASHBOARD_TOKEN_URL, setToken } from "../config.js";

function flagValue(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

export async function login(args: string[]): Promise<void> {
  if (args.includes("--oauth")) {
    stdout.write(
      "Browser-based OAuth login is on the roadmap. For now, use a token:\n" +
        "  heydecks login --token mcp_xxx\n",
    );
    return;
  }

  let token = flagValue(args, "--token");
  if (!token) {
    stdout.write(`Get your MCP token at ${DASHBOARD_TOKEN_URL}\n`);
    const rl = createInterface({ input: stdin, output: stdout });
    token = (await rl.question("Paste your heydecks token (mcp_...): ")).trim();
    rl.close();
  }

  if (!token) {
    process.stderr.write("No token provided.\n");
    process.exit(1);
  }

  setToken(token);
  stdout.write("Saved. You are logged in to heydecks.\n");
}
