# heydecks

The deck layer for AI agents. Turn any input into a brand-locked deck: a live link, a PDF, and a native PowerPoint, from Claude, Cursor, or your own agent.

Your model writes the slides. heydecks renders, brands, and exports them.

## What this package gives you

- **One-command setup** for Claude Desktop, Claude Code, and Cursor.
- **A local MCP connector** (stdio to the hosted heydecks server at `https://heydecks.com/mcp`).
- **The heydecks agent skill**, so your model knows the right workflow and slide types.

## Quick start

```sh
# 1. Grab a token at https://heydecks.com/dashboard/mcp
npx heydecks login --token mcp_xxx

# 2. Wire it into your AI host
npx heydecks install claude        # or: claude-code, cursor

# 3. (optional) teach your agent the workflow
npx heydecks skills add
```

Restart the app and ask: *"Make a 10-slide pitch deck from these notes and publish it on my brand."* You get back a live link, a PDF, and an editable PPTX.

## Install

- One-off: `npx heydecks <command>`
- Global: `npm install -g heydecks`

## Commands

| Command | What it does |
|---|---|
| `heydecks login [--token mcp_...]` | Save your token (or set `HEYDECKS_TOKEN`). |
| `heydecks install [host]` | Configure a host: `claude`, `claude-code`, or `cursor`. |
| `heydecks mcp` | Run the local MCP connector. Hosts launch this for you. |
| `heydecks skills add [--project]` | Install the heydecks agent skill. |
| `heydecks help` | Show help. |

## How it connects

heydecks runs a hosted MCP server at `https://heydecks.com/mcp` (Streamable HTTP, Bearer auth). `heydecks install` points your host at a small local connector (`heydecks mcp`) that forwards your calls upstream with your token, so it works even on hosts that only speak stdio.

### Manual config (Claude Desktop / Cursor)

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
```

## Use it from your own agent

Over MCP, the workflow is always:

1. `list_slide_templates` — discover every slide type and its fields.
2. `create_deck` — get a deck id.
3. `add_slides` (`replace: true`) — write the whole deck.
4. `publish_deck` — get the live link, the PDF, and the PPTX.

Building your own product instead of using a chat host? Call the REST API directly: `POST https://heydecks.com/v1/generate`. See [the docs](https://heydecks.com/docs).

A published deck costs 100 credits, the same on every channel. PDF and PPTX exports are free.

## The agent skill

`heydecks skills add` installs [`skills/heydecks/SKILL.md`](skills/heydecks/SKILL.md) into `~/.claude/skills/` (or `./.claude/skills/` with `--project`). It teaches the model the flow above, how to pick slide types, and how to stay on brand.

## Auth

Token-based today: get an `mcp_` token at [heydecks.com/dashboard/mcp](https://heydecks.com/dashboard/mcp). Browser-based OAuth is on the roadmap (`heydecks login --oauth`).

## MCP registry

This server is published to the official MCP registry as `com.heydecks/heydecks`. See [`server.json`](server.json).

## Links

- Product: [heydecks.com](https://heydecks.com)
- Docs: [heydecks.com/docs](https://heydecks.com/docs)
- MCP setup: [heydecks.com/docs/mcp](https://heydecks.com/docs/mcp)

## License

MIT, (c) unscripted GmbH.
