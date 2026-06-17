// Friendly getting-started banner shown after `npm install`.
// Stays quiet in CI and when the package is pulled in as a sub-dependency.
if (
  process.env.CI ||
  process.env.HEYDECKS_NO_BANNER ||
  process.env.npm_config_loglevel === "silent"
) {
  process.exit(0);
}

const global = process.env.npm_config_global === "true";
const run = global ? "heydecks" : "npx heydecks";

process.stdout.write(
  [
    "",
    "  ✓ heydecks installed - the deck layer for AI agents",
    "",
    `  Connect your AI:   ${run} install        (every host; or claude | cursor | claude-code)`,
    `  Add the skills:    ${run} skills add`,
    `  Get a token:       https://heydecks.com/dashboard/mcp`,
    "",
    "  Docs: https://heydecks.com/docs/cli",
    "",
  ].join("\n") + "\n",
);
