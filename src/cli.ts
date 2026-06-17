#!/usr/bin/env node
import { installHost } from "./commands/install.js";
import { login } from "./commands/login.js";
import { runMcp } from "./commands/mcp.js";
import { addSkills } from "./commands/skills.js";

const HELP = `heydecks - the deck layer for AI agents

Usage: heydecks <command> [options]

Commands:
  login [--token <mcp_...>]     Save your heydecks token (or set HEYDECKS_TOKEN)
  install [host]                Configure a host: claude | claude-code | cursor
  mcp                           Run the local MCP connector (hosts launch this)
  skills add [--project]        Install the heydecks agent skill
  help                          Show this help

Examples:
  npx heydecks login --token mcp_xxx
  npx heydecks install claude
  npx heydecks skills add
  npm install -g heydecks && heydecks install cursor

Token: https://heydecks.com/dashboard/mcp
Docs:  https://heydecks.com/docs/mcp`;

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2);

  switch (command) {
    case "mcp":
      await runMcp();
      break;
    case "login":
      await login(rest);
      break;
    case "install": {
      const host = rest[0] && !rest[0].startsWith("-") ? rest[0] : undefined;
      installHost(host, rest);
      break;
    }
    case "skills":
      if (rest[0] === "add") addSkills(rest.slice(1));
      else process.stdout.write("Usage: heydecks skills add [--project]\n");
      break;
    case "help":
    case "--help":
    case "-h":
    case undefined:
      process.stdout.write(HELP + "\n");
      break;
    default:
      process.stderr.write(`Unknown command: ${command}\n\n${HELP}\n`);
      process.exit(1);
  }
}

main().catch((err: unknown) => {
  process.stderr.write(
    `heydecks: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});
