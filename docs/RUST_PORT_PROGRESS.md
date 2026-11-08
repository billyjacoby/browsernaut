# Rust Port Progress

This file tracks where Billy is in the port described in
[RUST_PORT_ROADMAP.md](./RUST_PORT_ROADMAP.md). Read it first, whether you are Billy
resuming work or an LLM picking up the project.

Last updated: 2026-11-08

## Current position

**Phase 0, step 4 (Pin Rune).** The pin is in place and committed.

**Next action:** Phase 0, step 5: clone Rune outside this repo and run `examples/hello`.

## Rules for any LLM working on this

1. **Don't change the roadmap at or before the current position.** Billy is following it as
   written. Everything up to and including the current step is frozen. Only change steps after
   it. If something earlier turns out to be wrong, record it under "Corrections to finished
   steps" below.
2. **Update this file** when a step is finished or a decision changes, and move "Current
   position" forward.
3. **Billy writes the Rust.** The goal of the port is learning Rust. Prefer hints, explanations
   and review over finished code. Writing tests or setup config is fine when asked.
4. **Use mise for every tool** (`mise.toml`). Don't use `rustup component add`, `rustup target
   add` or `cargo install`. Crates stay in `Cargo.toml`, and normal Cargo commands are fine.
5. **Test commands before giving them to Billy** where you can, in a scratch folder rather than
   this repo. Don't put placeholder values in anything meant to be copied.
6. **Don't commit or push unless Billy asks.**
7. **API names in the roadmap are starting points.** Rune is pre-release, so check them against
   Rune's docs and source at the pinned commit.
8. **Claude Code users:** the `rust-port-progress` skill in `.claude/skills/` has the workflow for
   updating this file and the roadmap.

## Picking this up on a new machine

```sh
git clone https://github.com/billyjacoby/browsernaut
cd browsernaut
git checkout docs/rust-gpui-port-roadmap
mise trust
mise install
cargo build
```

## Status

| Phase | Status |
|---|---|
| 0: Setup and orientation | In progress |
| 0.5: Rune spike | Not started |
| 1–10 | Not started |

### Phase 0 steps

| Step | Status | Notes |
|---|---|---|
| 1. Read the Tauri Rust code | Not recorded | Reading exercise, so the repo can't show it |
| 2. `mise.toml` | Done | Rust 1.99.1, Node 24, pnpm 12.14.0 (see "Corrections to finished steps") |
| 3. Workspace and three crates | Done | `/target`-style ignore added to `.gitignore` |
| 4. Pin Rune | Done | Added for Billy by Claude |
| 5. Clone Rune and run `hello` | Not started | No clone at `~/Programming/rune` yet |

**Phase 0 "done when" so far:** `cargo fmt --all --check`, `cargo clippy --workspace -- -D
warnings` and `cargo test --workspace` all pass. Still needed: seeing a Rune window and a
snapshot, and confirming a fresh clone works.

### Step 5 details

```sh
cd ~/Programming
git clone --branch dev https://github.com/anomalyco/rune
cd rune
git checkout a7f276c
cargo run -p hello                                  # opens a window; click the switch
cargo run -p hello -- --snap hello.png --scene on   # renders with no window
open hello.png
cargo test -p hello
```

The build, snapshot and test were confirmed at this commit on Billy's Mac in a scratch folder.
Nobody has looked at the live window yet.

Then read `examples/hello/src/main.rs` and answer these. Check Billy's answers and give hints
rather than the solutions:

- `view` takes `s: &State`, but `on_press` gets `s: &mut State`. Why can't the view change state
  directly?
- Why is `#[derive(Default)]` on `State`? Where does it get used?
- The test calls `rt.pointer_down(x, y)` and `rt.pointer_up(x, y)`. Why does it then step frames
  before checking where the knob is?
- What does `|rt: &Runtime<State>| rt.presented("knob").unwrap().0[0]` borrow, and what does it
  return?

## Where the work lives

All Phase 0 work so far is committed and pushed on `docs/rust-gpui-port-roadmap`. That branch
is also the source of draft PR [#37](https://github.com/billyjacoby/browsernaut/pull/37), so the
PR now contains the setup code as well as the docs, and its description still says docs only.

## Decisions

| Decision | Detail |
|---|---|
| UI framework | [Rune](https://github.com/anomalyco/rune) and `rune-kit`, from `anomalyco/rune`. Not `rune-rs/rune`, which is a scripting language |
| Rune version | Commit `a7f276c3630f85a06a0230295da4d2bd172d8d3b`, set once in the root `Cargo.toml` under `[workspace.dependencies]` |
| Upgrading Rune | Change both `rev` values, and set `rust` in `mise.toml` to the channel in Rune's `rust-toolchain.toml` |
| Tools | All through mise. Keep Node and pnpm until Phase 10 so the Tauri app still builds |
| Crates | `crates/core` is `browsernaut-core`, `crates/macos` is `browsernaut-macos`, `crates/app` is `browsernaut` (binary) |
| Rust edition | 2024 |
| CI | Deferred to the end of Phase 1, so it doesn't run before there are real tests |

### CI

`.github/workflows/rust_checks.yml.disabled` is the commented-out draft for Phase 1 step 5. It
has the `.disabled` suffix because GitHub reports a commented-out workflow as a failed run on
every push. To turn it on, uncomment it and remove the suffix. It should only use `-p
browsernaut-core`, because the other crates won't build on Linux once they use macOS APIs and
Rune.

The existing `Type check & Lint` workflow fails on this branch and on `release-v1.3.6`, with
`ERR_PNPM_IGNORED_BUILDS` for `esbuild@0.24.0` during install. It isn't caused by the Rust work.

## Corrections to finished steps

- **Phase 0 step 2, the pnpm pin.** `pnpm = "12.14.0"` fails a normal `pnpm install
  --frozen-lockfile` with `ERR_PNPM_IGNORED_BUILDS` for `esbuild@0.24.0`. The original test had
  install scripts turned off, so it missed this. pnpm 10.34.9 exits 0 on the same lockfile, with
  a warning that the esbuild script was skipped. Unresolved: Billy needs to choose between
  pinning pnpm 10.34.9 in `mise.toml` and allowing esbuild's script in `package.json`. This only
  matters when working on the old Tauri app.

## Known risks

Phase 0.5 tests these on a real Mac. None of them have been tested end to end yet.

- **`http`/`https` links reaching `App::on_open_url`.** The whole app depends on this. Rune's
  docs only show custom schemes. Its source handles the `kAEGetURL` Apple Event with no scheme
  filter, so links should arrive.
- **Bundling.** Rune's `scripts/mac-app --scheme` writes one custom scheme only, with no
  `http`/`https` pair, document types or `LSUIElement`. It can't produce the real bundle.
- **`tray-icon` inside Rune's event loop**, and **window placement in physical pixels**.
- **Whether CI runners can run headless Rune tests and PNG snapshots.**

`App::on_open_url` takes a plain `fn` pointer, so it can't capture variables. Anything it needs
has to live in the app's state.

## Notes

Nothing yet.
