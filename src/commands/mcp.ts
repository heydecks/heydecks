import { DASHBOARD_TOKEN_URL, getToken, MCP_URL } from "../config.js";
import { startProxy } from "../proxy.js";

export async function runMcp(): Promise<void> {
  const token = getToken();
  if (!token) {
    process.stderr.write(
      'heydecks: no token found.\nRun "heydecks login" or set HEYDECKS_TOKEN.\n' +
        `Get a token at ${DASHBOARD_TOKEN_URL}\n`,
    );
    process.exit(1);
  }
  await startProxy(MCP_URL, token);
}
