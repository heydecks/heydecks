import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
// Compiled file lives at dist/commands/skills.js; skills/ ships at the package root.
const SKILLS_SRC = resolve(here, "..", "..", "skills");

function flagValue(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

export function addSkills(args: string[]): void {
  const project = args.includes("--project");
  const dest =
    flagValue(args, "--dir") ??
    (project
      ? join(process.cwd(), ".claude", "skills")
      : join(homedir(), ".claude", "skills"));

  if (!existsSync(SKILLS_SRC)) {
    process.stderr.write(`Skill source not found at ${SKILLS_SRC}\n`);
    process.exit(1);
  }

  // Install every bundled skill (each is a directory under skills/).
  const names = readdirSync(SKILLS_SRC).filter((name) =>
    statSync(join(SKILLS_SRC, name)).isDirectory(),
  );
  if (names.length === 0) {
    process.stderr.write(`No skills found in ${SKILLS_SRC}\n`);
    process.exit(1);
  }

  mkdirSync(dest, { recursive: true });
  for (const name of names) {
    cpSync(join(SKILLS_SRC, name), join(dest, name), { recursive: true });
  }

  process.stdout.write(
    `Installed ${names.length} skill${names.length === 1 ? "" : "s"} to:\n  ${dest}\n` +
      names.map((n) => `  - ${n}`).join("\n") +
      "\n\nRestart your agent or reload skills to pick them up.\n",
  );
}
