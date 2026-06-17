# heydecks

[![npm](https://img.shields.io/npm/v/heydecks.svg)](https://www.npmjs.com/package/heydecks) [![license](https://img.shields.io/npm/l/heydecks.svg)](./LICENSE)

Make real, on-brand decks from your AI. Your model writes the slides; **heydecks turns them into a shareable link, a PDF, and an editable PowerPoint.**

This package connects Claude, Cursor, or your own agent to heydecks in one command.

## Quickstart (about a minute)

```sh
npx heydecks install claude --token mcp_xxx
```

- Get your token at **https://heydecks.com/dashboard/mcp**.
- Swap `claude` for `cursor` or `claude-code`.

Restart the app and try:

> "Make a 10-slide pitch deck from these notes and publish it on my brand."

You get back a live link, a PDF, and a native PPTX.

## Do I need to install anything?

No. **`npx heydecks <command>`** always runs the latest version, nothing to install.

Use it often and want a permanent `heydecks` command? Install it globally:

```sh
npm install -g heydecks
```

Then drop the `npx` from any command (`heydecks install cursor`).

## Commands

| Command | What it does |
|---|---|
| `heydecks install <host> [--token mcp_...]` | Set up a host: `claude`, `cursor`, or `claude-code`. |
| `heydecks login [--token mcp_...]` | Save your token once, so you don't repeat it. |
| `heydecks skills add [--project]` | Install the heydecks agent skill (below). |
| `heydecks mcp` | The local connector. Your host runs this; you usually won't. |
| `heydecks help` | Show help. |

Your token can come from `--token`, from `heydecks login`, or from the `HEYDECKS_TOKEN` environment variable.

## Connect your assistant

### Claude Desktop or Cursor

```sh
npx heydecks install claude     # or: cursor
```

This writes the heydecks MCP server into the app's config. Restart the app to load it.

Prefer to do it by hand? Add this to the config file:

```json
{
  "mcpServers": {
    "heydecks": {
      "command": "npx",
      "args": ["-y", "heydecks", "mcp"],
      "env": { "HEYDECKS_TOKEN": "mcp_xxx" }
    }
  }
}
```

### Claude Code

```sh
claude mcp add heydecks -- npx -y heydecks mcp
npx heydecks login --token mcp_xxx
```

## The agent skills

```sh
npx heydecks skills add
```

Installs the heydecks skills into `~/.claude/skills/` (use `--project` for `./.claude/skills/`):

- **[heydecks](./skills/heydecks/SKILL.md)** — how to drive the tool: the build flow, choosing slide types, brand, and copy quality.
- **[heydecks-deck-design](./skills/heydecks-deck-design/SKILL.md)** — how to structure a deck that lands: the slide sequence for pitch decks, sales decks, board updates, and more.

Restart your agent to pick them up.

## How it works

heydecks runs a hosted MCP server at `https://heydecks.com/mcp`. The `heydecks mcp` connector is a tiny local bridge that forwards your host's requests there with your token, so it works even on hosts that only speak stdio. Over MCP the flow is always:

```
list_slide_templates  ->  create_deck  ->  add_slides  ->  publish_deck
```

`publish_deck` returns the live link, the PDF, and the PPTX. Your model writes every word; heydecks does the rendering, branding, and exports.

Building your own product instead of using a chat assistant? Skip MCP and call the REST API directly: `POST https://heydecks.com/v1/generate`. See the [docs](https://heydecks.com/docs).

A deck costs 100 credits, the same on every channel. PDF and PPTX exports are always free.

## Authentication

Use an `mcp_` token from [heydecks.com/dashboard/mcp](https://heydecks.com/dashboard/mcp). Browser-based OAuth is on the roadmap (`heydecks login --oauth`).

## MCP registry

Published to the official MCP registry as `com.heydecks/heydecks`. See [`server.json`](./server.json).

## Links

- Product: https://heydecks.com
- Docs: https://heydecks.com/docs
- MCP setup: https://heydecks.com/docs/mcp

## License

MIT, &copy; unscripted GmbH.
