---
name: unhobble
description: Use when an agent-facing instruction surface constrains a capable model with rigid steps, duplicated rules, stale workarounds, repeated reminders, interface-teaching examples, or other legacy scaffolding.
license: MIT
compatibility: Self-contained. Requires only access to inspect and edit the target instruction surfaces.
---

# Unhobble

Remove legacy instructions that over-constrain a capable model without still earning that restriction.

A **hobble** is instruction that once helped weaker models perform reliably, but now gets in the way of stronger models by over-constraining their judgment or capabilities.

Not every constraint is a hobble. Keep real requirements, safety boundaries, environmental limits, product facts, and non-obvious gotchas. The test is behavioral: **does this restriction still prevent a concrete failure or enforce a real constraint?** If not, it is load without leverage.

Use `/unhobble` for the relevant instruction surfaces in the current task, or `/unhobble <path or artifacts>` to target specific material. Natural-language scope is fine: `please /unhobble my global Claude rules`.

Unhobbling has two moves:

- **Cut** scaffolding that no longer earns its place.
- **Add** the smaller thing it was standing in for when something real would otherwise be lost: a clear goal, an expressive interface, a rubric, a runnable check, or one authoritative definition.

Do both. Pure deletion can remove useful structure; pure addition creates sediment.

## 1. Read the whole surface

Treat one instruction surface as the unit of work: a skill, agent file, instruction file, hook message, output style, or similar artifact.

Read it end to end before editing. Then search the surrounding repository for other carriers of the same meaning. A rule repeated in four places is one decision, applied to all four.

Prefer live sources over prose caches. If config, schemas, tool help, directory structure, or executable checks already reveal a fact cheaply, documentation usually should not restate it.

## 2. Classify what you find

Use these transformations:

| Signal | Better shape |
|---|---|
| Rules pre-decide cases the model can judge from context | State the goal and only the non-obvious constraint |
| Examples mainly teach a call shape | Improve the interface or parameter names |
| Material matters only on one branch | Move it behind that branch or remove it from the always-read path |
| The same meaning appears repeatedly | Keep one authoritative carrier |
| Prose mirrors machine-readable state | Read the source directly |
| Prose describes a standard that can be checked | Prefer a rubric, test, schema, or runnable check |
| Workaround targets a failure mode that no longer occurs | Remove it |
| Sentence restates default competent behavior | Remove it |

Keep real environmental constraints, product facts, non-obvious gotchas, and hard safety boundaries.

## 3. Rewrite removal-first

For each block, decide **keep, replace, or remove**.

When removing a block, do not preserve its meaning in a softer reminder "just in case." That is the same carrier with worse clarity.

When replacing a block, make the replacement more direct than the original. Prefer positive targets over lists of forbidden behavior. Prefer one strong concept over several synonymous reminders.

**Keep the current state, cut the history of the change.** The artifact should directly reflect what is intended now, not narrate the change or negate what came before. Keep pointers only where people would still reasonably look for that information; historical proximity alone is not enough.

A removed block earns restoration only when you can name a concrete failure its absence would cause and point to evidence for that failure. Archival loss by itself is not a defect.

## 4. Follow dependency death

A cut often leaves artifacts that only existed to support it. Remove or repair them in the same pass:

- pointers to deleted sections;
- duplicated reminders elsewhere;
- hooks or gates whose messages teach a rule that no longer exists;
- tests or fixtures pinned to removed wording rather than behavior;
- docs that describe the old behavior as current.

Historical records may remain historical. Instructional surfaces must describe the system that exists now.

## 5. Review the delta

Inspect the result against four failure modes:

1. **Under-cut** — scaffolding survived without behavioral value.
2. **Over-cut** — a removal creates a concrete failure.
3. **Wrong shape** — the replacement is less expressive or changes the requirement.
4. **Missing add** — deletion exposed a real gap that needs a smaller interface, rubric, check, or definition.

For over-cut claims, require the named failure and evidence. "The rule no longer lives anywhere" is not evidence.

When the runtime can provide a fresh isolated reviewer, use one after a substantial pass and give it the before/after artifacts without your defense of the changes. Treat its findings by the same evidence bar.

## Done

The pass is complete when:

- every block in the target surface was considered;
- every duplicated carrier affected by the decision is consistent;
- no dependency points at removed behavior;
- surviving instructions express real constraints rather than model babysitting;
- every disputed removal has a concrete behavioral argument, not an archival one.
