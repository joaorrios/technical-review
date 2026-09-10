# Technical Review

Two independent technical review workflows for coding agents:

- **approach-review** — challenges a proposed technical approach before implementation.
- **implementation-review** — inspects the technical aspects of a completed implementation before acceptance or shipping.

Both workflows are owned by the agent that produced the artifact. The approach author or implementer dispatches a fresh isolated reviewer, gives it an unprimed briefing, and resolves every substantive finding with either a change/fix or an evidenced disagreement.

## Why two reviews?

They catch different failure classes.

An approach can be internally coherent while relying on a false assumption about the real system. An implementation can faithfully follow a sound approach while still contain a bug. Technical Review keeps those checks separate instead of turning one reviewer into a catch-all compliance checklist.

## Review posture

The reviewers reason from first principles rather than a long checklist.

- Approach review uses **assumptions, completeness, system fit, and failure behavior** as lenses.
- Implementation review uses **correctness, robustness, system fit, and engineering integrity** as lenses.

The lenses are deliberately not boundaries. Reviewers follow evidence wherever it leads, and `No substantive ... findings.` is a valid result.

## Install

Install with the open Agent Skills CLI:

```bash
npx skills add joaorrios/technical-review
```

Choose either skill or both when prompted. The CLI handles each supported coding agent's skill location.

Each skill is self-contained:

```text
skills/
  approach-review/
    SKILL.md
    agents/
      reviewer.md
  implementation-review/
    SKILL.md
    agents/
      reviewer.md
```

`SKILL.md` is consumed by the author/implementer. It dispatches a fresh isolated subagent and uses the bundled `agents/reviewer.md` as that reviewer's instructions. The reviewer therefore does not need to be registered as a persistent named agent in Claude Code, Codex, Cursor, Cline, OpenCode, or another runtime.

The runtime only needs a way to spawn an isolated subagent. When it supports a read-only boundary, the skill asks the caller to use it.

## Independence

The reviewer receives the artifact and coordinates needed to investigate the real system, not the author's reasoning, defenses, suspected weaknesses, or expected conclusions.

Written requirements and prior technical decisions are evidence of intent, not authority over technical correctness. A review may therefore identify a defect even when the artifact faithfully follows what was written.

## Versioning

Technical Review follows Semantic Versioning for the package as a whole. The initial release line starts at `0.1.0` while the review contracts are still settling.

Changesets records the intended bump for future changes:

```bash
npm run changeset
npm run version
```

Release tags use `vMAJOR.MINOR.PATCH`. Versioning is independent from installation: `npx skills` installs and updates the skills from the repository, while SemVer tags and releases identify published package states.

## License

MIT
