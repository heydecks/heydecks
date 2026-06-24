#!/usr/bin/env node
import { createRequire } from "node:module";
import { installHost } from "./commands/install.js";
import { login } from "./commands/login.js";
import { runMcp } from "./commands/mcp.js";
import { addSkills } from "./commands/skills.js";

const pkg = createRequire(import.meta.url)("../package.json") as {
  version: string;
};

const HELP = `heydecks - the deck layer for AI agents

Usage: heydecks <command> [options]

Commands:
  install [host]                Connect a host with OAuth (sign in), or --token.
                                No host (or "all") = every installed host.
                                hosts: claude | cursor | claude-code
                                flags: --token <mcp_...>  --skills  --no-skills
  login [--token <mcp_...>]     Save an mcp_ token (only needed for the token path)
  skills add [--project]        Install the heydecks agent skills
  mcp                           Local connector for the token path (hosts launch it)
  help                          Show this help
  version                       Show the installed CLI version

Examples:
  npx heydecks install                       # every host, sign in with OAuth
  npx heydecks install cursor                # just one host
  npx heydecks install --token mcp_xxx       # use an mcp_ token instead
  npx heydecks skills add

Token: https://heydecks.com/dashboard/mcp
Docs:  https://heydecks.com/docs/mcp`;

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2);

  switch (command) {
    case "version":
    case "--version":
    case "-v":
      process.stdout.write(`heydecks ${pkg.version}\n`);
      break;
    case "mcp":
      await runMcp();
      break;
    case "login":
      await login(rest);
      break;
    case "install": {
      const host = rest[0] && !rest[0].startsWith("-") ? rest[0] : undefined;
      await installHost(host, rest);
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
