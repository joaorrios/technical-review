#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SUPPORTED = ["claude-code", "codex", "cursor", "opencode", "cline"];
const ALIASES = new Map([
  ["claude", "claude-code"],
  ["claude-code", "claude-code"],
  ["codex", "codex"],
  ["cursor", "cursor"],
  ["opencode", "opencode"],
  ["open-code", "opencode"],
  ["cline", "cline"],
]);
const REVIEWERS = [
  { skill: "approach-review", file: "reviewer.md" },
  { skill: "implementation-review", file: "reviewer.md" },
];

function usage() {
  console.log(`technical-review

Usage:
  technical-review install --agent <agent> [--agent <agent> ...] [--global] [--force]
  technical-review install --all [--global] [--force]
  technical-review list

Agents:
  ${SUPPORTED.join(", ")}

Examples:
  technical-review install -a claude-code -g
  technical-review install -a codex -a cursor -g
  technical-review install --all --force
`);
}

function parseArgs(argv) {
  const result = { command: argv[0] ?? "help", agents: [], global: false, force: false, all: false, root: process.cwd() };
  for (let i = 1; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "-a" || arg === "--agent") result.agents.push(argv[++i]);
    else if (arg === "-g" || arg === "--global") result.global = true;
    else if (arg === "--force") result.force = true;
    else if (arg === "--all") result.all = true;
    else if (arg === "--root") result.root = resolve(argv[++i]);
    else if (arg === "-h" || arg === "--help") result.command = "help";
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return result;
}

function normalizeAgent(value) {
  const normalized = ALIASES.get(value);
  if (!normalized) throw new Error(`Unsupported agent: ${value}`);
  return normalized;
}

function locations(agent, global, projectRoot) {
  const home = homedir();
  const project = {
    "claude-code": [join(projectRoot, ".claude", "skills"), join(projectRoot, ".claude", "agents")],
    codex: [join(projectRoot, ".codex", "skills"), join(projectRoot, ".codex", "agents")],
    cursor: [join(projectRoot, ".cursor", "skills"), join(projectRoot, ".cursor", "agents")],
    opencode: [join(projectRoot, ".opencode", "skills"), join(projectRoot, ".opencode", "agents")],
    cline: [join(projectRoot, ".cline", "skills"), null],
  };
  const user = {
    "claude-code": [join(home, ".claude", "skills"), join(home, ".claude", "agents")],
    codex: [join(home, ".codex", "skills"), join(home, ".codex", "agents")],
    cursor: [join(home, ".cursor", "skills"), join(home, ".cursor", "agents")],
    opencode: [join(home, ".config", "opencode", "skills"), join(home, ".config", "opencode", "agents")],
    cline: [join(home, ".cline", "skills"), null],
  };
  const [skillsDir, agentsDir] = (global ? user : project)[agent];
  return { skillsDir, agentsDir };
}

function parseReviewer(path) {
  const text = readFileSync(path, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Reviewer lacks frontmatter: ${path}`);
  const frontmatter = match[1];
  const body = match[2].trim();
  const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (!name || !description) throw new Error(`Reviewer requires name and description: ${path}`);
  return { name, description, body };
}

function yamlString(value) {
  return JSON.stringify(value);
}

function renderReviewer(agent, reviewer) {
  const { name, description, body } = reviewer;
  if (agent === "claude-code") {
    return `---\nname: ${name}\ndescription: ${yamlString(description)}\nmodel: inherit\neffort: high\ntools: Read, Glob, Grep, Bash\n---\n\n${body}\n`;
  }
  if (agent === "cursor") {
    return `---\nname: ${name}\ndescription: ${yamlString(description)}\nmodel: inherit\nreadonly: true\n---\n\n${body}\n`;
  }
  if (agent === "opencode") {
    return `---\ndescription: ${yamlString(description)}\nmode: subagent\npermissions:\n  - action: edit\n    resource: "*"\n    effect: deny\n---\n\n${body}\n`;
  }
  if (agent === "codex") {
    const escapedBody = body.replaceAll('"""', '\\"\\"\\"');
    return `name = ${JSON.stringify(name)}\ndescription = ${JSON.stringify(description)}\nmodel_reasoning_effort = "high"\nsandbox_mode = "read-only"\ndeveloper_instructions = """\n${escapedBody}\n"""\n`;
  }
  throw new Error(`No native reviewer renderer for ${agent}`);
}

function replacePath(path, force) {
  if (!existsSync(path)) return;
  if (!force) throw new Error(`Already exists: ${path}\nRe-run with --force to replace it.`);
  rmSync(path, { recursive: true, force: true });
}

function installSkill(skill, skillsDir, force) {
  const source = join(ROOT, "skills", skill);
  const destination = join(skillsDir, skill);
  replacePath(destination, force);
  mkdirSync(skillsDir, { recursive: true });
  cpSync(source, destination, { recursive: true });
  return destination;
}

function installReviewer(agent, reviewerPath, agentsDir, force) {
  if (!agentsDir) return null;
  const reviewer = parseReviewer(reviewerPath);
  const extension = agent === "codex" ? ".toml" : ".md";
  const destination = join(agentsDir, `${reviewer.name}${extension}`);
  replacePath(destination, force);
  mkdirSync(agentsDir, { recursive: true });
  writeFileSync(destination, renderReviewer(agent, reviewer), "utf8");
  return destination;
}

function install(agent, options) {
  const { skillsDir, agentsDir } = locations(agent, options.global, options.root);
  const written = [];
  for (const entry of REVIEWERS) {
    written.push(installSkill(entry.skill, skillsDir, options.force));
    const reviewerPath = join(ROOT, "skills", entry.skill, entry.file);
    const reviewerDestination = installReviewer(agent, reviewerPath, agentsDir, options.force);
    if (reviewerDestination) written.push(reviewerDestination);
  }
  return { agent, written, nativeReviewer: Boolean(agentsDir) };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.command === "help") return usage();
  if (options.command === "list") {
    console.log(SUPPORTED.join("\n"));
    return;
  }
  if (options.command !== "install") throw new Error(`Unknown command: ${options.command}`);

  const requested = options.all ? SUPPORTED : options.agents.map(normalizeAgent);
  const agents = [...new Set(requested)];
  if (agents.length === 0) throw new Error("Choose at least one --agent or use --all.");

  for (const agent of agents) {
    const result = install(agent, options);
    console.log(`\n${agent}:`);
    for (const path of result.written) console.log(`  installed ${path}`);
    if (!result.nativeReviewer) {
      console.log("  native named reviewer: not installed; the skill dispatches Cline's fresh read-only subagent with reviewer.md as its instructions");
    }
  }
}

try {
  main();
} catch (error) {
  console.error(`technical-review: ${error.message}`);
  process.exitCode = 1;
}
