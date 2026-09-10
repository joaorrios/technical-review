import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CLI = join(ROOT, "bin", "technical-review.mjs");

function text(path) {
  return readFileSync(path, "utf8");
}

for (const skill of ["approach-review", "implementation-review"]) {
  const skillFile = join(ROOT, "skills", skill, "SKILL.md");
  const reviewerFile = join(ROOT, "skills", skill, "reviewer.md");
  assert.ok(existsSync(skillFile), `${skill} SKILL.md exists`);
  assert.ok(existsSync(reviewerFile), `${skill} reviewer.md exists`);
  assert.match(text(skillFile), /^description: Dispatches an independent technical reviewer/m, `${skill} description is caller-oriented`);
  assert.match(text(reviewerFile), /These are lenses, not boundaries\. Follow the evidence wherever it leads\./, `${skill} reviewer keeps lenses open-ended`);
}

const temp = mkdtempSync(join(tmpdir(), "technical-review-test-"));
try {
  execFileSync(process.execPath, [CLI, "install", "--all", "--root", temp, "--force"], { stdio: "pipe" });

  const expected = [
    ".claude/skills/approach-review/SKILL.md",
    ".claude/skills/implementation-review/SKILL.md",
    ".claude/agents/approach-reviewer.md",
    ".claude/agents/implementation-reviewer.md",
    ".codex/skills/approach-review/SKILL.md",
    ".codex/skills/implementation-review/SKILL.md",
    ".codex/agents/approach-reviewer.toml",
    ".codex/agents/implementation-reviewer.toml",
    ".cursor/skills/approach-review/SKILL.md",
    ".cursor/skills/implementation-review/SKILL.md",
    ".cursor/agents/approach-reviewer.md",
    ".cursor/agents/implementation-reviewer.md",
    ".opencode/skills/approach-review/SKILL.md",
    ".opencode/skills/implementation-review/SKILL.md",
    ".opencode/agents/approach-reviewer.md",
    ".opencode/agents/implementation-reviewer.md",
    ".cline/skills/approach-review/SKILL.md",
    ".cline/skills/implementation-review/SKILL.md"
  ];

  for (const relative of expected) assert.ok(existsSync(join(temp, relative)), `installed ${relative}`);
  assert.ok(!existsSync(join(temp, ".cline", "agents", "approach-reviewer.md")), "Cline does not receive a fictional persistent agent format");

  assert.match(text(join(temp, ".cursor", "agents", "implementation-reviewer.md")), /readonly: true/, "Cursor reviewer is read-only");
  assert.match(text(join(temp, ".codex", "agents", "implementation-reviewer.toml")), /model_reasoning_effort = "high"/, "Codex reviewer requests high reasoning effort");
  assert.match(text(join(temp, ".opencode", "agents", "implementation-reviewer.md")), /mode: subagent/, "OpenCode reviewer is a subagent");
  assert.match(text(join(temp, ".claude", "agents", "implementation-reviewer.md")), /effort: high/, "Claude reviewer requests high effort");
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log("technical-review tests passed");
