import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Bridge a local stdio MCP server to the remote heydecks Streamable HTTP
 * server. The host (Claude Desktop, Cursor, ...) speaks stdio to us; we forward
 * tool discovery and tool calls upstream over HTTP with the Bearer token.
 *
 * heydecks exposes tools only (list_slide_templates, create_deck, add_slides,
 * publish_deck, ...), so a tools passthrough is sufficient. Extend with
 * resource/prompt handlers if heydecks ever exposes them.
 */
export async function startProxy(url: string, token: string): Promise<void> {
  const upstream = new Client(
    { name: "heydecks-cli", version: "0.1.0" },
    { capabilities: {} },
  );
  await upstream.connect(
    new StreamableHTTPClientTransport(new URL(url), {
      requestInit: { headers: { Authorization: `Bearer ${token}` } },
    }),
  );

  const local = new Server(
    { name: "heydecks", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  local.setRequestHandler(ListToolsRequestSchema, () => upstream.listTools());
  local.setRequestHandler(CallToolRequestSchema, (request) =>
    upstream.callTool(request.params),
  );

  const shutdown = async () => {
    await Promise.allSettled([local.close(), upstream.close()]);
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  await local.connect(new StdioServerTransport());
}
