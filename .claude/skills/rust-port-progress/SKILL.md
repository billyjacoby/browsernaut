---
name: rust-port-progress
description: Manage the Browsernaut Rust port's progress file and roadmap. Use when Billy asks where he is in the port, finishes or moves to a step, wants to resume or hand off, asks to change the roadmap, or records a decision or correction about the port.
---

# Rust port progress

Two files drive the port:

- `docs/RUST_PORT_PROGRESS.md`: the current position, rules, decisions and handoff notes. Its "Rules for any LLM working on this" section applies to all port work.
- `docs/RUST_PORT_ROADMAP.md`: the plan Billy is following.

Always read the progress file first, then the roadmap section for the current phase. Don't rely on memory of where he was.

## Report where Billy is, or resume

1. Compare "Current position" with the repo: `git status -sb`, the files the step should have produced, and the step's "Done when" checks.
2. Say the phase and step, the next action, and anything uncommitted or unpushed. If the file and the repo disagree, say so instead of picking one.

## Mark a step finished

1. Check the step's work really exists. Run its commands where you can. If it can't be checked from the repo (reading, seeing a window), ask Billy or mark it as not recorded.
2. Update "Current position" and "Next action", the status tables, and "Last updated".
3. When a phase ends, confirm its "Done when" line is met before moving on.

## Change the roadmap

Everything up to and including the current step is frozen.

1. Find the current step's location in the roadmap.
2. If the change is after it, edit the roadmap. New steps must not renumber the current step or anything before it.
3. If the change touches a frozen step, leave the roadmap alone and add the fix to "Corrections to finished steps" in the progress file, with what Billy should do about it.
4. Run `git diff docs/RUST_PORT_ROADMAP.md` and confirm every changed hunk comes after the current step.

Before writing commands or config into either file, test them in a scratch folder where you can. Never write placeholder values into anything meant to be copied.

## Record decisions, risks and notes

Add to "Decisions", "Known risks" or "Notes" in the progress file. Remove entries once they're no longer true. Any later LLM has only this file for context, so give enough detail to act on without this conversation.

## Commits

Only commit or push when Billy asks. Before ending a session where progress changed, tell him what's unpushed, because unpushed work can't be picked up on another machine.
