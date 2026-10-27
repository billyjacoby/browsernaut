# Browsernaut → Rust + GPUI: A Learn-By-Porting Roadmap

This roadmap ports Browsernaut from **Tauri v1 + React/TypeScript** to a
**pure Rust app built on [GPUI](https://www.gpui.rs/) and
[GPUI Kit](https://gpui-kit.com)** (`gpui-kit`, which re-exports
`gpui`, `gpui-base`, and `gpui-component`).

**You write the code.** Each phase lists:

- **Learn**: the Rust concepts the phase covers, with pointers to read first.
- **Port**: what to build, and which existing file it replaces.
- **Hints**: nudges, not solutions. Try it yourself first.
- **Done when**: concrete checks so you know when to move on.

The phases go from "pure Rust, no UI" to "full GPUI app", so you learn
the language before you fight a UI framework. Phases 1–3 compile and test on
any OS. Phase 4 onward needs a Mac.

> **About the GPUI API:** GPUI and GPUI Kit move fast. Method names in this doc
> (`on_open_urls`, `observe_window_activation`, `WindowKind::PopUp`, …) are
> *things to look for*, not guaranteed signatures. Pin one `gpui-kit` version
> and treat its docs.rs page and `examples/` folder as the source of truth.

---

## How the current app works

You'll be re-implementing each of these pieces:

| Piece | Where it lives today | What it does |
|---|---|---|
| App registry | `src/config/apps.ts` | ~75 known browsers/apps, some with a `privateArg` (incognito flag) or `convertUrl` (e.g. Discord → `discord://`) |
| App discovery | `src-tauri/src/apps.rs`, `src/utils/get-installed-app-names.ts` | Scans `/Applications`, `~/Applications`, `/System/Applications` for `*.app`, keeps the ones in the registry |
| Installed-app merge | `src/stores/appDataStore/actions.ts` → `getInstalledApps` | Merges newly found apps into the saved, user-ordered list |
| Opening a URL | `src/utils/open-app.ts` | Shells out to `open -a <App> [--background] [--new --args <privateArg>] <url>` |
| Persistence | `src/lib/zustand-persist-tauri.ts` + `tauri-plugin-store` | Saves state (apps, order, hotkeys, theme, last URL) to `.settings.dat` |
| Default browser | `swift/Browsernaut/src/lib.swift` via `swift-rs` | Get/set default browser through LaunchServices |
| App icons | same Swift file | `NSWorkspace` icon → PNG → base64 data URL |
| Receiving URLs | `src-tauri/src/main.rs` (`tauri_plugin_deep_link`) | macOS sends the clicked link to the app, which opens the picker |
| Picker window | `src-tauri/src/main.rs` `open_picker_window`, `src/views/AppPicker/*` | Small always-on-top window at the cursor, keyboard nav, hotkeys, closes on blur/Esc |
| Preferences window | `src/views/Preferences/*` | Tabs: General, Apps (reorder + hotkeys), Theme, About |
| Tray menu | `src-tauri/src/main.rs` | Menu bar icon: "Open last URL", "Preferences", "Quit" |
| Themes | `src/stores/themeDataSlice/*` | Light/dark/system + user-editable HSL custom themes |
| Updater / release | `tauri.conf.json`, `updates.json`, `.github/workflows/publish.yml` | Auto-update, signing, DMG release |

---

## Target architecture

Use a **Cargo workspace** with three crates. The split teaches you modules,
crate boundaries, and visibility, and it keeps most of your logic testable
without a GUI.

```text
browsernaut/
├── Cargo.toml                 # [workspace] members = ["crates/*"]
├── crates/
│   ├── core/                  # browsernaut-core: pure Rust, no UI, no macOS APIs
│   │   └── src/{lib.rs, registry.rs, discovery.rs, launch.rs, settings.rs, theme.rs}
│   ├── macos/                 # browsernaut-macos: all the platform glue (objc2 / Command)
│   │   └── src/{lib.rs, default_browser.rs, icons.rs, cursor.rs}
│   └── app/                   # browsernaut: the GPUI binary
│       └── src/{main.rs, state.rs, picker.rs, prefs/…, tray.rs}
├── src-tauri/  src/  swift/   # the old app; leave it working until Phase 10
```

Rule of thumb: if a function can be written without GPUI or macOS, it goes in
`core` **with tests**.

---

## Phase 0: Setup and orientation (½–1 day)

**Learn**
- Install with `rustup`. Add `rust-analyzer` to your editor and run `cargo clippy` often; Clippy is a good teacher.
- Read *The Rust Programming Language* ("the Book") ch. 1–6: ownership, borrowing, structs, enums, `match`.
- Optional warm-up: do the first ~30 [Rustlings](https://github.com/rust-lang/rustlings) exercises.

**Port**
1. Read `src-tauri/src/main.rs` and `apps.rs` line by line. For every `&`, `unwrap()`, `Option`, `move`, and `unsafe`, write down what you *think* it does, then check.
2. Create the workspace and three empty crates (`cargo new --lib crates/core`, and so on). The top-level `Cargo.toml` contains only `[workspace]`.
3. Add `crates/core` to CI: a GitHub Actions job running `cargo fmt --check`, `cargo clippy -- -D warnings`, and `cargo test`.

**Done when:** `cargo test --workspace` passes (with zero tests) and CI is green.

---

## Phase 1: The app registry (core) (1–2 days)

Replaces `src/config/apps.ts` and the argument-building half of `src/utils/open-app.ts`.

**Learn**
- Structs, `enum`s, `impl` blocks, `Option<T>`
- `&'static str` vs `String` (why can a registry baked into the binary use `'static`?)
- Slices and arrays: `&[T]`, `const`/`static`
- `Cow<'_, str>`: return the original URL untouched when nothing changes, and allocate only when it does
- Unit tests: `#[cfg(test)] mod tests`, `assert_eq!`
- Crate: [`regex`](https://docs.rs/regex) (and `std::sync::LazyLock` so you compile a regex only once)

**Port**
1. Model one entry of the registry, for example:
   - `name: &'static str`
   - `private_arg: Option<&'static str>`
   - a URL converter. TypeScript uses a closure. In Rust, choose between an `enum UrlConversion { None, Discord }` and a `fn(&str) -> Cow<str>` pointer. **Try the enum first.** Explain to yourself why it's simpler than storing closures.
2. Port all ~75 entries into a `pub static APPS: &[AppSpec]`.
3. Write `fn find(name: &str) -> Option<&'static AppSpec>`.
4. Write a **pure** function that builds the `open` arguments:
   `fn open_args(app: &AppSpec, url: &str, opts: LaunchOptions) -> Vec<String>`
   where `LaunchOptions { background: bool, private: bool }`.

**Hints**
- Pay attention to argument order: the URL must come **last**, after `--new --args <privateArg>`. See the comment in `open-app.ts`.
- 🐛 **Spot the bug:** `AppButton.tsx` calls `onBrowserButtonClick(app, event.altKey, event.shiftKey)`, but the function's parameters are `(app, shiftPressed, altPressed)`. Alt and Shift are swapped on click. A named-field `LaunchOptions` struct makes this mistake hard to write in Rust. Note that and move on.

**Done when:** tests cover a plain app, a private-window app (Firefox `--private-window`, Chrome `--incognito`), and the three Discord URL shapes (`discord.com`, `ptb.discord.com`, `canary.discord.com`).

---

## Phase 2: App discovery and list merging (core) (1–2 days)

Replaces `src-tauri/src/apps.rs` (drops the `rust_search` dependency) and `getInstalledApps` / `updateHotCode` in `actions.ts`.

**Learn**
- `std::fs::read_dir`, `Path` vs `PathBuf` (the `&str`/`String` pair for paths)
- `Result<T, E>` and the `?` operator
- Iterators: `filter_map`, `map`, `collect`, `retain`, `any`, `position`
- `HashSet` for membership checks
- `#[must_use]`, and why Rust warns about values you ignore

**Port**
1. `fn scan_app_dirs(dirs: &[PathBuf]) -> Vec<String>` returns the app names (folder name without `.app`) found one level deep. Expand `~` yourself (`std::env::var("HOME")` or the `dirs` crate).
2. `fn installed_known_apps(found: &[String]) -> Vec<&'static AppSpec>` keeps only apps in the registry.
3. Define the user's saved entry: `struct InstalledApp { name: String, hotkey: Option<char> }`.
4. `fn merge(saved: Vec<InstalledApp>, found: &[&str]) -> Vec<InstalledApp>` keeps the saved order and hotkeys, appends newly installed apps, and drops uninstalled ones.
5. `fn set_hotkey(apps: &mut [InstalledApp], name: &str, key: Option<char>)` and `fn move_app(apps: &mut Vec<InstalledApp>, from: usize, to: usize)`.

**Hints**
- 🐛 **Spot the bug #2:** in `actions.ts`, `newInstalledApps.filter(...)` is called but its result is thrown away, so uninstalled apps are **never removed**. Rust's iterator adapters are `#[must_use]`, and the compiler would have warned you. Use `Vec::retain` to do it in place.
- Make `scan_app_dirs` testable: have tests create a temp directory with fake `Foo.app/` folders (`tempfile` crate as a dev-dependency).
- Notice that `set_hotkey` takes `&mut [InstalledApp]` while `move_app` takes `&mut Vec<_>`. Why does one need the `Vec` and the other doesn't?

**Done when:** `merge` has tests for "new app appears", "app uninstalled", and "order and hotkeys preserved", and a temp-dir test covers scanning.

---

## Phase 3: Settings persistence (core) (1–2 days)

Replaces `zustand-persist-tauri.ts`, `tauri-plugin-store`, and the persisted fields of `appDataStore` and `themeDataSlice`.

**Learn**
- `serde` derive (`Serialize`, `Deserialize`), `#[serde(default)]`, `#[serde(rename_all = "camelCase")]`
- `Default` trait
- Error handling: your own error `enum` with [`thiserror`](https://docs.rs/thiserror) in libraries, and [`anyhow`](https://docs.rs/anyhow) in the binary
- Atomic file writes (write to a temp file, then `rename`)

**Port**
1. `struct Settings { apps: Vec<InstalledApp>, last_url: Option<String>, has_seen_welcome: bool, prefs_tab: PrefsTab, app_theme: AppTheme, custom_themes: Vec<CustomTheme>, active_custom_theme: String }`. Turn the TS string unions (`"general" | "apps" | …`) into Rust `enum`s.
2. `Settings::load(path) -> Result<Settings, SettingsError>`: a missing file returns `Settings::default()`, and a corrupt file is an error, not a panic.
3. `Settings::save(&self, path) -> Result<(), SettingsError>`
4. Location: `~/Library/Application Support/com.billyjacoby.browsernaut/settings.json` (the `dirs` crate gives you the base dir).

**Stretch (good serde practice):** migrate existing users. Tauri's store file is probably in the same Application Support folder as `.settings.dat`. Check on your Mac. It holds JSON *inside a JSON string inside a JSON string* (`"appData"` → `"unique-name"` → `{ state, version }`). Write `fn migrate_from_tauri(path) -> Option<Settings>` that peels those layers off.

**Done when:** a round-trip test (`save` then `load` gives the same struct) passes, along with tests for "missing file → defaults" and "garbage file → Err".

---

## Phase 4: macOS integration (macos crate) (2–4 days)

Replaces `swift/Browsernaut/src/lib.swift`, `swift-rs`, `enigo`, and the shell-out in `open-app.ts`.

**Learn**
- `std::process::Command`
- `#[cfg(target_os = "macos")]` and conditional compilation
- `unsafe`: what it promises, and how to wrap it in a safe function
- Calling Objective-C from Rust with the [`objc2`](https://docs.rs/objc2) family (`objc2-foundation`, `objc2-app-kit`)

**Port**
1. **Launch:** `fn launch(args: &[String]) -> std::io::Result<()>` runs `open` with the args from Phase 1. *(Easiest; do it first.)*
2. **Cursor position:** `fn cursor_location() -> (f64, f64)` uses `NSEvent::mouseLocation`. macOS screen coordinates have their origin at the **bottom-left**, so you'll need to flip Y using the screen height. This replaces `enigo`.
3. **Default browser:**
   - `fn is_default_browser() -> bool` asks NSWorkspace which app opens `https://` URLs and compares it to your bundle.
   - `fn make_default_browser()` uses NSWorkspace's "set default application for URL scheme" API (macOS 12+), or LaunchServices' `LSSetDefaultHandlerForURLScheme` as the Swift code does.
4. **Icons:** `fn app_icon_png(app_name: &str, size: u32) -> Option<Vec<u8>>` gets the icon from NSWorkspace and converts it to PNG **bytes**. Skip base64: GPUI can render image bytes directly, so the base64 data-URL step goes away.

**Hints**
- Allowed shortcut: if objc2 is too much at first, keep using `swift-rs` and the existing Swift package temporarily, then come back. Getting a working app first is fine.
- Keep every `unsafe` block small, with a `// SAFETY:` comment explaining why it's sound. Expose only safe functions from the crate.
- Write a tiny `examples/probe.rs` in the crate that prints the results of all four functions. That's your manual test harness.

**Done when:** `cargo run -p browsernaut-macos --example probe` prints your default browser, the cursor position, the PNG size of Safari's icon, and opens a URL in a chosen browser.

---

## Phase 5: First GPUI window (2–3 days)

The UI starts here. Do **not** port the picker yet; get comfortable with GPUI first.

**Learn**
- Read the GPUI Kit "Getting Started" guide and run 3–4 of its examples
- GPUI's model:
  - `Application` / `App` (global context)
  - `Window`
  - `Entity<T>` (a handle to state that GPUI owns)
  - `Context<T>` (what you get inside an entity's methods)
  - the `Render` trait
  - `cx.notify()` to re-render
- The element builder style: `div().flex().flex_col().gap_2().child(...)`. It reads a lot like Tailwind, which helps here.
- Closures: `Fn` vs `FnMut` vs `FnOnce`, `move`, and why event handlers want `'static`
- `cx.listener(...)` for handlers that need `&mut Self`

**Port**
1. `crates/app`: depend on `gpui-kit` (one pinned version) and your two crates.
2. Open one window that renders a hard-coded list of three app names with GPUI Kit `Button`s.
3. Add a counter: clicking a button increments a number in your view struct and re-renders. This is the "aha" step for `cx.notify()`.
4. Load `Settings` at startup and render the real installed-app list (names only).

**Hints**
- Compare GPUI's `Entity` + `cx.notify()` with React's `useState`, and Zustand's store with a GPUI *global* (`cx.set_global` / `cx.global`). Your `appDataStore` probably becomes either a global `AppState` or an `Entity<AppState>` that both windows hold.
- When the borrow checker complains inside a closure, the usual fix is to clone a handle (an `Entity<T>` or `WeakEntity<T>`) **before** the `move`.

**Done when:** `cargo run -p browsernaut` opens a window that lists your installed browsers from `settings.json`.

---

## Phase 6: The picker window (3–5 days)

Replaces `open_picker_window` in `main.rs` and `src/views/AppPicker/*`.

**Learn**
- Window options: size, position, kind (look for a pop-up / floating kind for "always on top"), titlebar
- Focus handling: `FocusHandle`, `track_focus`
- Actions and key bindings: GPUI's `actions!` macro, `cx.bind_keys`, `on_action`
- Raw key events with modifiers (`on_key_down`, `event.keystroke`)
- Window activation events (look for `observe_window_activation`) for close-on-blur
- Rendering images from bytes (`img(...)` with an image source)

**Port**
1. Open a 250×300 window centred horizontally on the cursor, 48 px above it (same math as `main.rs`).
2. Render each app as a row: name, hotkey letter, icon (from Phase 4, loaded once and cached). Show the URL's host at the bottom (`UrlBar.tsx`; use the `url` crate instead of `new URL()`).
3. Keyboard:
   - ↑/↓ moves the selection (a `selected: usize` in your view; no DOM refs needed)
   - Enter opens the selected app
   - Esc closes the window
   - Typing a hotkey letter opens that app
   - Shift means private window, Alt (⌥) means open in background
4. Mouse: hover selects the row, click opens the app with the current modifiers.
5. Close the window when it loses focus or after a successful open.

**Hints**
- Build the hotkey lookup as a `HashMap<char, usize>` once per render, or keep it in state and rebuild it when apps change. Think about which is clearer. Both are fine at this size.
- Clamp the selection index with `saturating_sub` / `min` instead of `if` chains.

**Done when:** with a hard-coded URL, you can open the picker, pick Firefox with `f`, pick a private Chrome window with Shift+`c`, and Esc or clicking away dismisses it.

---

## Phase 7: Becoming a real macOS URL handler (3–5 days, the hard part)

Replaces `tauri_plugin_deep_link`, the system tray code, `Info.plist`, and `ActivationPolicy::Accessory`.

**Learn**
- How macOS delivers URLs: Apple Events, which arrive **only when running as a `.app` bundle**
- App bundling with [`cargo-packager`](https://github.com/crabnebula-dev/cargo-packager) or [`cargo-bundle`](https://github.com/burtonageo/cargo-bundle)
- Channels (`std::sync::mpsc` or `async-channel`) and GPUI's executors (`cx.spawn`, `cx.background_spawn`) for getting events from another library into GPUI

**Port**
1. **Receiving URLs:** register a handler for opened URLs on the GPUI application (look for `on_open_urls`). In it: save `last_url` to settings, then open (or re-show) the picker.
2. **Bundle:** produce `Browsernaut.app` with the existing `Info.plist` keys:
   - `CFBundleURLTypes` (http/https/ftp/file)
   - `CFBundleDocumentTypes` (.html, …)
   - `LSUIElement = true` (no Dock icon; replaces the accessory activation policy)
   - the same bundle id `com.billyjacoby.browsernaut`, so "set as default browser" keeps working
3. **Tray / menu bar icon:** GPUI doesn't provide a status-bar item, so use the [`tray-icon`](https://docs.rs/tray-icon) crate (+ its `muda` menus). Recreate "Open last URL ⌘O", "Preferences ⌘P", and "Quit ⌘Q". Forward its menu events into GPUI through a channel that a `cx.spawn` task listens on.
4. **First launch:** if `!has_seen_welcome`, open Preferences (same as `App.tsx`).
5. **Dev loop:** add a CLI fallback (`browsernaut --url https://example.com`) so you can test the picker without bundling every time.

**Hints**
- Expect to spend time here. It's integration work, not hard Rust, but the feedback loop is slower. Make a script (`bin/dev-bundle.sh`) that builds, bundles, and runs `open -a ./target/.../Browsernaut.app https://example.com`.
- `tray-icon` must be created on the main thread **after** the app has started. Create it inside GPUI's `run` callback.

**Done when:** you can set the bundled app as your default browser, click a link in Slack/Mail, and the Rust picker appears at your cursor.

> 🎉 **Milestone:** at this point the Rust app can replace the Tauri app for daily use. Use it yourself for a week before continuing.

---

## Phase 8: Preferences window (4–6 days)

Replaces `src/views/Preferences/*`.

**Learn**
- Composing views: one `Entity` per tab, the parent holds them
- GPUI Kit components: `Tabs`/`TabBar`, `Button`, `Input`, `Switch`, `Dialog`/`Modal`, notifications
- Drag and drop in GPUI (look for `on_drag` / `on_drop`)
- Running blocking work off the main thread (rescanning `/Applications`, loading icons) with `cx.background_spawn` and getting the result back

**Port, one tab at a time**
1. **General** (`TabGeneral.tsx`):
   - default-browser status + "Set As Default Browser" (Phase 4)
   - "Rescan" (Phase 2, run in the background)
   - "Reset" with a confirmation dialog
   - "Show welcome message"
   - Skip the confetti (or don't — a particle effect is a fun stretch exercise).
2. **Apps** (`TabApps.tsx`):
   - reorderable list (drag and drop, or ↑/↓ buttons first, then add drag later)
   - per-app one-character hotkey input; Backspace/Delete clears it
3. **About** (`TabAbout.tsx`): version from `env!("CARGO_PKG_VERSION")`, Homepage and Issues links (open with your Phase 4 `launch`), "Check for update" (stub until Phase 10).
4. **Welcome modal** (`WelcomeModal.tsx`): shown on first run; dismissing it sets `has_seen_welcome`.
5. Save settings whenever something changes. Consider debouncing so you don't write the file on every keystroke.

**Done when:** every setting you can change in the Tauri prefs window can be changed here, persists across restarts, and the picker reflects the changes immediately (shared state!).

---

## Phase 9: Themes (3–5 days, scope it yourself)

Replaces `src/stores/themeDataSlice/*`, `useIsDarkMode.ts`, `ColorPicker.tsx`, `AddThemeSheet.tsx`.

**Learn**
- GPUI Kit's theme system (`Theme`, theme colors, light/dark mode, following the system appearance)
- `HashMap` vs a struct with named fields (which fits 19 fixed color slots better?)
- Colour math: HSL ↔ RGBA (GPUI has `hsla()`, which is very convenient)

**Port**
1. Light / Dark / System selection, wired to GPUI Kit's theme and the OS appearance changes.
2. Port the Browsernaut gradient (green → purple, `BG_GRADIENT_ACTIVE` in `CONSTANTS.ts`) for the selected picker row.
3. **Custom themes (optional and largest):** model `CustomTheme`, including the `inherits` / `inheritedFrom` relationship between colour slots, then map it onto GPUI Kit theme colours. Add, rename, delete, and edit with a colour picker.

**Hints**
- The TS code deep-clones with `JSON.parse(JSON.stringify(...))` all over the place. In Rust, `#[derive(Clone)]` + `.clone()` does this, and the borrow checker tells you when you actually need to.
- Consider modelling inheritance as "this slot *is* a reference to that slot" (`enum Slot { Value(Hsla), Inherit(SlotId) }`) instead of keeping two lists in sync. Ask yourself which version can't get out of sync.

**Done when:** theme choice persists, follows the system when set to System, and the picker and preferences windows both use it.

---

## Phase 10: Shipping and deleting the old app (2–4 days)

Replaces `tauri.conf.json` bundling/updater, `bin/apple.sh`, `.github/workflows/publish.yml`, and finally `src/`, `src-tauri/`, `swift/`, and the Node toolchain.

**Port**
1. **Universal binary:** build both `aarch64-apple-darwin` and `x86_64-apple-darwin`, combine with `lipo`. Or check whether your packager supports universal builds directly.
2. **Sign and notarize:** reuse the Apple secrets the current workflow uses (`codesign`, `xcrun notarytool`).
3. **DMG** via your packager.
4. **Updates:** pick one:
   - `cargo-packager-updater` (closest to what Tauri did; reuse the minisign key idea)
   - Sparkle
   - simplest: "Check for update" fetches the latest GitHub release JSON with `reqwest`/`ureq` and opens the download page
5. **CI:** a `publish` workflow on tags that builds, signs, notarizes, and uploads the DMG. Keep the Phase 0 check job.
6. **Homebrew:** update `bin/commit-homebrew-update.sh` for the new artifact name if it changes.
7. Delete the Tauri/TS app, `package.json`, `pnpm-lock.yaml`, and the Node CI job. Update `README.md`.

**Done when:** pushing a tag produces a signed, notarized DMG, and an existing Tauri user who installs it keeps their apps, order, and hotkeys (Phase 3 migration).

---

## Suggested reading order alongside the phases

| Phase | Book chapters / resources |
|---|---|
| 0–1 | The Book ch. 1–6, 11 (testing) |
| 2 | ch. 8 (collections), 9 (errors), 13 (closures and iterators) |
| 3 | ch. 10 (generics and traits); serde.rs docs |
| 4 | ch. 7 (modules), 20.1 (unsafe); objc2 docs and examples |
| 5–6 | ch. 15 (smart pointers: `Rc`, `RefCell`, why GPUI has `Entity`); GPUI Kit docs and examples |
| 7 | ch. 16 (concurrency: threads and channels); async basics (*Asynchronous Programming in Rust*) |
| 8–10 | Read Zed's source (`crates/gpui/examples`) when you're stuck on how to do something in GPUI |

## Working with Claude as a tutor

Since the goal is for *you* to write the code, ask in ways that keep it that way:

- "I'm on Phase 2, step 4. Here's my `merge`. **Review it, don't rewrite it.**"
- "Give me a hint, not the answer: why does the borrow checker reject this closure?"
- "Explain this compiler error line by line."
- "What would idiomatic Rust do differently here, and why?"
- "Write tests for my function" (tests are fair game to get help with; they don't take the learning away)

Good luck, and enjoy the borrow checker. It's on your side, eventually. 🦀
