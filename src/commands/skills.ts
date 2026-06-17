import { cpSync, existsSync, mkdirSync } from "node:fs";
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

  const src = join(SKILLS_SRC, "heydecks");
  if (!existsSync(src)) {
    process.stderr.write(`Skill source not found at ${src}\n`);
    process.exit(1);
  }

  const target = join(dest, "heydecks");
  mkdirSync(dirname(target), { recursive: true });
  cpSync(src, target, { recursive: true });
  process.stdout.write(
    `Installed the heydecks skill to:\n  ${target}\n\n` +
      "Restart your agent or reload skills to pick it up.\n",
  );
}
