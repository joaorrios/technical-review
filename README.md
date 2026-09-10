# Technical Review

Two independent technical review workflows for coding agents:

- **approach-review** — challenges a proposed technical approach before implementation.
- **implementation-review** — inspects the technical aspects of a completed implementation before acceptance or shipping.

Both workflows are owned by the person/agent that produced the artifact. The author or implementer dispatches a fresh reviewer, gives it an unprimed briefing, and resolves every substantive finding with either a change/fix or an evidenced disagreement.

## Why two reviews?

They catch different failure classes.

An approach can be internally coherent while relying on a false assumption about the real system. An implementation can faithfully follow a sound approach while still contain a bug. Technical Review keeps those checks separate instead of turning one reviewer into a catch-all compliance checklist.

## Review posture

The reviewers reason from first principles rather than a long checklist.

- Approach review uses **assumptions, completeness, system fit, and failure behavior** as lenses.
- Implementation review uses **correctness, robustness, system fit, and engineering integrity** as lenses.

The lenses are deliberately not boundaries. Reviewers follow evidence wherever it leads, and `No substantive ... findings.` is a valid result.

## Install

### Standard Agent Skills

The repository follows the Agent Skills layout, so the skills can be installed with the open `skills` CLI:

```bash
npx skills add joaorrios/technical-review
```

That path is useful for any Agent-Skills-compatible runtime. Each skill carries its canonical `reviewer.md`, so it can still dispatch a fresh generic subagent even when no named reviewer profile is installed.

### Full skill + native reviewer package

The repository also ships a small zero-dependency installer that writes the skills and native reviewer definitions for supported runtimes:

```bash
npx github:joaorrios/technical-review install --agent cursor --global
npx github:joaorrios/technical-review install --agent codex --global
npx github:joaorrios/technical-review install --agent claude-code --global
npx github:joaorrios/technical-review install --agent opencode --global
npx github:joaorrios/technical-review install --agent cline --global
```

Install several at once:

```bash
npx github:joaorrios/technical-review install -a codex -a cursor -a opencode --global
```

Or all supported runtimes:

```bash
npx github:joaorrios/technical-review install --all --global
```

Project-local installation is the default; omit `--global`. Existing files are preserved unless `--force` is supplied.

### Claude Code plugin

This repository is also a Claude Code marketplace/plugin. The plugin uses the same skill and reviewer sources; Claude-specific packaging is an adapter, not the source of truth.

```text
/plugin marketplace add joaorrios/technical-review
/plugin install technical-review@technical-review
```

## Runtime mapping

| Runtime | Skills | Named reviewer |
| --- | --- | --- |
| Claude Code | `.claude/skills/` | `.claude/agents/*.md` |
| Codex | `.codex/skills/` | `.codex/agents/*.toml` |
| Cursor | `.cursor/skills/` | `.cursor/agents/*.md` |
| OpenCode | `.opencode/skills/` | `.opencode/agents/*.md` |
| Cline | `.cline/skills/` | Uses Cline's fresh read-only subagent with the skill's `reviewer.md` prompt |

Global installs use each runtime's documented user-level location.

There is intentionally no universal checked-in `.agents/agents/` format: Agent Skills are portable today, but persistent custom-subagent formats are not. The installer renders native agent definitions from the canonical reviewer prompts instead of maintaining five copies.

## Repository layout

```text
skills/
  approach-review/
    SKILL.md        # instructions for the approach author
    reviewer.md     # canonical independent reviewer
  implementation-review/
    SKILL.md        # instructions for the implementer
    reviewer.md     # canonical independent reviewer
bin/
  technical-review.mjs
.claude-plugin/
  plugin.json
  marketplace.json
```

## Development

```bash
npm test
```

The test installs the package into a temporary project for every supported runtime and checks that skills and native agent adapters land in the expected locations.

## License

MIT
