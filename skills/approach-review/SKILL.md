---
name: approach-review
description: Dispatches an independent technical reviewer to challenge a proposed approach before implementation, then requires the approach author to resolve every substantive finding. Use after choosing how to build a substantive change and before coding it.
license: MIT
compatibility: Requires a runtime capable of spawning an isolated subagent for full independence.
---

# Approach Review

Review the technical approach through an independent context before implementation.

## Author

You are the **approach author**. Do not perform the review yourself.

Dispatch a fresh isolated subagent with strong software-reasoning capability and use `agents/reviewer.md` as its reviewer instructions. Prefer a different model family from the author when a comparably capable one is available. Keep the reviewer read-only when the runtime supports that boundary.

Keep the briefing unprimed. Give the reviewer the proposed approach, its repository or worktree, and enough coordinates to inspect the real system. Let the artifact speak for itself: keep the author's rationale, suspected weaknesses, defenses, and expected conclusions out of the briefing.

The reviewer owns investigation and may inspect the surrounding system as needed.

## Resolve

Consume every substantive finding individually.

- **change** — revise the approach to address the finding.
- **disagree** — keep the approach and give a specific technical reason supported by evidence.

A missing requirement is not a reason to dismiss a technical defect. If a finding exposes an omission in the written intent, update the affected artifact rather than using its silence as justification.

Do not defer, rank away, or silently drop substantive findings. After material revisions, use judgment about whether the changed approach needs another independent pass.

## Done

The review is complete when an independent reviewer has inspected the approach and every substantive finding has an explicit `change` or evidenced `disagree` disposition.
