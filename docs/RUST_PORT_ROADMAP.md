# Browsernaut → Rust + Rune: A Learn-By-Porting Roadmap

This roadmap ports Browsernaut from **Tauri v1 + React/TypeScript** to a
**pure Rust app built on [Rune](https://github.com/anomalyco/rune)**. Rune is a
GPU-rendered Rust UI framework with its own renderer, layout (Taffy), text and
springs, plus a component kit, `rune-kit` (buttons, switches, selects, text
inputs, menus, toasts, reorderable rows, …).

**You write the code.** Each phase lists:

- **Learn**: the Rust concepts the phase covers, with pointers to read first.
- **Port**: what to build, and which existing file it replaces.
- **Hints**: nudges, not solutions. Try it yourself first.
- **Done when**: concrete checks so you know when to move on.

The phases go from "pure Rust, no UI" to "full Rune app", so you learn the
language before you deal with a UI framework. Phases 1–3 compile and test on
any OS. The Phase 0.5 spike and Phase 4 onward need a Mac.

> **About the Rune API:** Rune is pre-release. Its README says to pin a `rev` of
> its `dev` branch (`dev` is never rewritten). The API names in this doc
> (`App::on_open_url`, `on_window_focus`, `WindowOptions`, `ImageCache`, …) come
> from its README at the time of writing. Treat them as *things to look for*,
> and treat `crates/rune/README.md`, `crates/rune-kit/README.md` and `examples/`
> **at your pinned rev** as the source of truth. Every API name in this doc was
> checked against `dev` at `a7f276c` (2026-11-08), which is a reasonable first rev
> to pin. Rune doesn't take pull requests; bugs and ideas go in its GitHub issues.
>
> **Phase 0.5 is a spike** that checks the risky parts on a real Mac before you
> build anything on them. Don't skip it.

---

## How the current app works

You'll be re-implementing each of these pieces:

| Piece | Where it lives today | What it does |
|---|---|---|
| App registry | `src/config/apps.ts` | ~90 known browsers/apps, some with a `privateArg` (incognito flag) or `convertUrl` (e.g. Discord → `discord://`) |
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

## How Rune's model differs from React

Rune works more like Elm than React, and that's good for learning Rust:

- Each window has **one state struct** (`S`) and a **view function**:
  `fn view(s: &S, cx: &mut Cx<S>) -> El`. The view only *reads* state (`&S`).
- Event handlers are closures that get `&mut S`: `.on_press(|s: &mut S| s.count += 1)`.
  Rune queues them, runs them between frames, re-runs your view, and diffs the result.
- There's no `useState`, no hooks, and no store library. Zustand's whole job is done
  by "a struct, plus functions that take `&mut` to it".
- The borrow checker matters less here than in callback-heavy frameworks: you never hold
  `&mut S` across frames, so most of your code is plain functions over plain data.

Rune also renders **headlessly**. A unit test can build a `Runtime`, tap an
element by its key, step frames, and assert on state or on where elements were
drawn. The CLI can render PNGs and dump the element tree (`--snap`, `--tree`,
`--script`). You'll use this from Phase 5 on to test UI the same way you test
plain functions.

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
│   └── app/                   # browsernaut: the Rune binary
│       └── src/{main.rs, shared.rs, picker.rs, prefs/…, tray.rs}
├── src-tauri/  src/  swift/   # the old app; leave it working until Phase 10
```

Rule of thumb: if a function can be written without Rune or macOS, it goes in
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
4. Clone Rune and run `examples/hello` on your Mac (`cargo run -p hello`). Then render it headlessly (`cargo run -p hello -- --snap hello.png --scene on`) and open the PNG. Read its `#[cfg(test)]` test; you'll write tests like it later.

**Done when:** `cargo test --workspace` passes (with zero tests), CI is green, and you've seen a Rune window and a Rune snapshot.

---

## Phase 0.5: Rune spike — check the risky parts first (1–2 days, on a Mac)

A **spike** is throwaway code that answers one question. Each check below covers
something the rest of the plan depends on but that Rune's docs don't fully
promise. Do them now, while changing course is cheap. Write the spike in a
scratch crate (`spikes/rune-spike`, outside the workspace members) and delete it
afterwards.

Write each result in `docs/SPIKE_NOTES.md`: what you ran, what happened, and
what it changes in the plan. That file is the real deliverable.

**Learn**
- How a `.app` bundle is laid out (`Contents/MacOS`, `Contents/Info.plist`, `Contents/Resources`)
- `lsregister` and Launch Services, and how macOS picks the default browser
- `fn` pointers vs closures: `App::on_open_url` takes `fn(&mut S, &str, &mut Tx)`, a plain function pointer that **can't capture variables**. Work out where the data it needs has to live instead (hint: in `S`).

**Checks**

1. **Pin and build.** Add `rune` + `rune-kit` as git dependencies pinned to one `rev`. Build and run `examples/hello` and `examples/background` from that rev.
   - *Pass:* both run, and the `rev` is recorded in `SPIKE_NOTES.md`.

2. **Browser links reach `on_open_url`.** This is the one the whole app depends on. Rune's docs only show custom schemes (`myapp://`). Its source (`crates/rune/src/open_url/incoming.rs`) handles the `kAEGetURL` Apple Event, which macOS uses for every link, with no scheme filter, so `http`/`https` *should* arrive. Prove it:
   - Make a windowless, `.accessory()` spike app whose `on_open_url` appends each URL to a log file.
   - Bundle it by hand with an `Info.plist` that declares `http`/`https` in `CFBundleURLTypes` and sets `LSUIElement`. Give it a **different** bundle id from Browsernaut (e.g. `com.billyjacoby.browsernaut-spike`) so you don't confuse Launch Services.
   - Register it (`lsregister -f Spike.app`), run `open -a Spike.app https://example.com`, then make it the default browser in System Settings and click a link in Mail or Slack. **Switch your default browser back afterwards.**
   - Also test the cold-start case: quit the spike, then click a link. The link that *launches* the app must arrive too.
   - *Pass:* both URLs show up in the log, warm and cold.
   - *If it fails:* stop and decide before Phase 5. Options: install your own Apple Event handler with `objc2` before `run` (Rune's docs say an app's own handler installed before `run` is kept), or open an issue on Rune. Write down what you chose.

3. **Bundling a browser.** `scripts/mac-app --scheme NAME` writes `CFBundleURLTypes` with **one** custom scheme and nothing else: no `http`/`https` pair, no `CFBundleDocumentTypes`, no `LSUIElement`. It's still useful for fast relaunches, but it can't produce the real bundle. Pick the release path now:
   - Try [`cargo-packager`](https://github.com/crabnebula-dev/cargo-packager) with the existing `src-tauri/Info.plist` keys merged in, or a small script that runs `mac-app` and then patches `Info.plist` with `plutil`.
   - *Pass:* one command produces a `.app` with all the keys from check 2, and the spike's links still arrive from that bundle.

4. **Tray icon inside Rune's event loop.** Rune doesn't provide a menu-bar item. Create a [`tray-icon`](https://docs.rs/tray-icon) icon with one menu item from inside the running app: try `AppSpec::setup`, or an `AppHandle::update`, which runs on the main thread. Make the item call `handle.open()`.
   - *Pass:* the icon appears in the menu bar of an accessory app, and clicking the item shows the window.

5. **Picker window placement.** Open a borderless, `always_on_top` window and move it to the cursor with `AppHandle::set_position`, which takes **physical pixels**. Get the cursor from `NSEvent::mouseLocation` (bottom-left origin, in points).
   - *Pass:* the window lands at the cursor on a Retina screen, and on a second display if you have one.

6. **Headless tests in CI.** Copy `examples/hello`'s `#[cfg(test)]` test into the spike and run it on a GitHub Actions `macos-latest` runner and on `ubuntu-latest`. Also try a `--snap` PNG on each.
   - *Pass:* you know which runners can run `Runtime` tests and which can render PNGs. Runtime tests drive state and layout and may not need a GPU. PNG snapshots render, so they probably do.

**Done when:** `docs/SPIKE_NOTES.md` has a pass/fail and a decision for every check. If check 2 or 3 failed, update Phases 7 and 10 before starting Phase 1.

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
2. Port all ~90 entries into a `pub static APPS: &[AppSpec]`.
3. Write `fn find(name: &str) -> Option<&'static AppSpec>`.
4. Write a **pure** function that builds the `open` arguments:
   `fn open_args(app: &AppSpec, url: &str, opts: LaunchOptions) -> Vec<String>`
   where `LaunchOptions { background: bool, private: bool }`.

**Hints**
- Pay attention to argument order: the URL must come **last**, after `--new --args <privateArg>`. See the comment in `open-app.ts`.
- Name your struct something other than `AppSpec` if it clashes with `rune::AppSpec` later (e.g. `KnownApp`). Name clashes across crates are a good intro to `use … as …`.
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
2. `fn installed_known_apps(found: &[String]) -> Vec<&'static KnownApp>` keeps only apps in the registry.
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
2. **Cursor position:** `fn cursor_location() -> (f64, f64)` uses `NSEvent::mouseLocation`. macOS screen coordinates have their origin at the **bottom-left**, so you'll need to flip Y using the screen height. Rune positions windows in **physical pixels** (`AppHandle::set_position`), so you'll also multiply by the screen's backing scale factor. This replaces `enigo`.
3. **Default browser:**
   - `fn is_default_browser() -> bool` asks NSWorkspace which app opens `https://` URLs and compares it to your bundle.
   - `fn make_default_browser()` uses NSWorkspace's "set default application for URL scheme" API (macOS 12+), or LaunchServices' `LSSetDefaultHandlerForURLScheme` as the Swift code does.
4. **Icons:** `fn app_icon_png(app_name: &str, size: u32) -> Option<Vec<u8>>` gets the icon from NSWorkspace and converts it to PNG **bytes**. Skip base64: Rune's `ImageCache::load(bytes)` takes PNG bytes directly, so the base64 data-URL step goes away.

**Hints**
- Allowed shortcut: if objc2 is too much at first, keep using `swift-rs` and the existing Swift package temporarily, then come back. Getting a working app first is fine.
- Keep every `unsafe` block small, with a `// SAFETY:` comment explaining why it's sound. Expose only safe functions from the crate.
- Write a tiny `examples/probe.rs` in the crate that prints the results of all four functions. That's your manual test harness.

**Done when:** `cargo run -p browsernaut-macos --example probe` prints your default browser, the cursor position, the PNG size of Safari's icon, and opens a URL in a chosen browser.

---

## Phase 5: First Rune window (2–3 days)

The UI starts here. Do **not** port the picker yet; get comfortable with Rune first.

**Learn**
- Rune's README sections: the view API, layout gotchas (`.grow`, `.min_h(0.0)`), focus, key routing
- Rune's model:
  - `AppSpec::new(title, size, init, view)` (or `rune::run(spec)` for one window)
  - `El` builders: `col()`, `row()`, `el()`, `text()`, with `.key("…")`, `.gap()`, `.fill()`, `.radius()`
  - handlers: `.on_press(|s: &mut S| …)`, and `.on_press_tx(|s, tx| …)` when you need the `Tx` (to close the window, scroll, copy, …)
  - `rune-kit`: `Kit::from_palette(…)` or a theme crate, and components like `Button::new("…").on_press(…).build(k)`
- Closures: `Fn` vs `FnMut` vs `FnOnce`, `move`, and why handlers need to be `'static`
- Headless tests: `rune::Runtime::new(state, view, size, env)`, `rt.frame(dt)`, `rt.find("key")`, `rt.pointer_down/up`, `rt.state`

**Port**
1. `crates/app`: depend on `rune` and `rune-kit` (git, the `rev` you pinned in Phase 0.5) and your two crates.
2. Open one window that renders a hard-coded list of three app names as `rune-kit` `Button`s.
3. Add a counter: clicking a button increments a number in your state struct, and the label updates. Notice you never told Rune to re-render; mutating state in a handler is enough.
4. Write your first **headless test**: tap the button by key, step a few frames, assert the counter changed.
5. Load `Settings` at startup and render the real installed-app list (names only).

**Hints**
- Compare with React: `useState` + `setState` becomes "a field on `S`" + "a handler that mutates it". Zustand's store becomes your state struct, and its actions become `impl S { fn …(&mut self) }`.
- Give every element you'll test or scroll to a stable `.key(…)`. `rune-kit` keys its own parts (`label`, `icon`, …), so prefix yours (`app/firefox`).
- Run your view headlessly with `--snap` / `--tree` when something looks wrong. The tree JSON tells you each element's laid-out rect.

**Done when:** `cargo run -p browsernaut` opens a window that lists your installed browsers from `settings.json`, and `cargo test -p browsernaut` runs at least one headless UI test.

---

## Phase 6: The picker window (3–5 days)

Replaces `open_picker_window` in `main.rs` and `src/views/AppPicker/*`.

**Learn**
- `rune::App` for apps that outlive their window: `.windowless()`, `.keep_running()`, `.accessory()`, `.on_close(…)`
- `AppHandle<S>` (`Clone + Send + Sync`): `show()`, `focus()`, `hide()`, `open()`, `set_position(…)`, `update(|s, tx| …)`
- `WindowOptions`: `borderless`, `always_on_top`, `resizable`, `min_size`/`max_size`
- Focus and keys: `.focusable(true)`, `.focus_group()` with `.role("listbox")` for arrow-key movement, the window's `on_key`, modifier state (`mods`)
- `.on_window_focus(|s, focused, tx| …)` on the root, for close-on-blur
- Images: `rune::ImageCache::new(waker)`, `cache.load(png_bytes)`, `el().size(40.0, 40.0).pixels(icon.pixels())`

**Port**
1. Build the picker as a windowless, accessory `App` with a borderless, always-on-top 250×300 window. Show it centred horizontally on the cursor, 48 px above it (same math as `main.rs`, using Phase 4's `cursor_location()` and `set_position`, as in the spike's check 5).
2. Render each app as a row: name, hotkey letter, icon (from Phase 4, loaded through `ImageCache` once and kept in state). Show the URL's host at the bottom (`UrlBar.tsx`; use the `url` crate instead of `new URL()`).
3. Keyboard:
   - ↑/↓ moves the selection (try `focus_group` first; if you need full control, keep a `selected: usize` in state and handle the arrows in `on_key`)
   - Enter opens the selected app
   - Esc closes the window
   - Typing a hotkey letter opens that app
   - Shift means private window, Alt (⌥) means open in background
4. Mouse: hover selects the row, click opens the app with the current modifiers.
5. Hide the window when it loses focus (`on_window_focus` with `focused == false`) or after a successful open.
6. Headless tests: "pressing `f` opens Firefox", "Shift+`c` opens Chrome private", "Esc closes". Make `launch` injectable (e.g. a `Vec<Vec<String>>` of recorded launches in test state, or a trait) so tests don't actually run `open`.

**Hints**
- Build the hotkey lookup as a `HashMap<char, usize>` once per view, or keep it in state and rebuild it when apps change. Think about which is clearer. Both are fine at this size.
- Clamp the selection index with `saturating_sub` / `min` instead of `if` chains.
- Making `launch` swappable for tests is a good first use of a **trait** (`trait Launcher { fn launch(&self, args: &[String]); }`) or a function pointer. Try both and compare.

**Done when:** with a hard-coded URL, you can open the picker, pick Firefox with `f`, pick a private Chrome window with Shift+`c`, and Esc or clicking away dismisses it. The headless tests pass.

---

## Phase 7: Becoming a real macOS URL handler (3–5 days, the hard part)

Replaces `tauri_plugin_deep_link`, the system tray code, `Info.plist`, and `ActivationPolicy::Accessory`.

**Learn**
- How macOS delivers URLs: Apple Events, which arrive **only when running as a `.app` bundle**
- `App::on_open_url(|s, url: &str, tx| …)`: Rune installs the get-URL Apple Event handler and replays the link that launched the app
- Threads and `Send`/`Sync`: why `AppHandle` can be moved into another thread's closure, and what `handle.update(|s, tx| …)` does (it runs your closure on the UI thread)
- App bundling: use the release path you chose in the Phase 0.5 spike (check 3), and Rune's `scripts/mac-app` only for quick relaunches

**Port**
1. **Receiving URLs:** register `on_open_url` on the picker app (the spike's check 2 proved `http`/`https` links arrive). In it: validate the URL (it comes from anyone who can run `open`), save `last_url` to settings, then show and focus the picker at the cursor. Rune doesn't bring the window forward for you. The handler is a `fn` pointer, so it can't capture your `AppHandle`: keep the handle (and anything else it needs) in the picker's state.
2. **Bundle:** produce `Browsernaut.app` with the existing `Info.plist` keys:
   - `CFBundleURLTypes` (http/https/ftp/file)
   - `CFBundleDocumentTypes` (.html, …)
   - `LSUIElement = true` (no Dock icon; pairs with `.accessory()`)
   - the same bundle id `com.billyjacoby.browsernaut`, so "set as default browser" keeps working
3. **Tray / menu bar icon:** Rune doesn't provide a status-bar item ("the app owns its tray"), so use the [`tray-icon`](https://docs.rs/tray-icon) crate (+ its `muda` menus). Recreate "Open last URL ⌘O", "Preferences ⌘P", and "Quit ⌘Q". In each menu callback, call `AppHandle::update` / `open` / `quit` on a cloned handle. No channels or polling needed.
4. **First launch:** if `!has_seen_welcome`, open Preferences (same as `App.tsx`).
5. **Dev loop:** add a CLI fallback (`browsernaut --url https://example.com`, via `AppSpec::extra_args`) so you can test the picker without bundling every time.

**Hints**
- Expect to spend time here. It's integration work, not hard Rust, but the feedback loop is slower. Start from your spike code: checks 2–5 already proved each piece works on its own, and this phase is mostly wiring them together.
- Make the bundle step one script (`bin/dev-bundle.sh`) that builds, bundles with your chosen packager, and runs `open -a ./…/Browsernaut.app https://example.com`.
- Create `tray-icon` the way the spike's check 4 showed works (on the main thread, after the event loop has started).

**Done when:** you can set the bundled app as your default browser, click a link in Slack/Mail, and the Rust picker appears at your cursor.

> 🎉 **Milestone:** at this point the Rust app can replace the Tauri app for daily use. Use it yourself for a week before continuing.

---

## Phase 8: Preferences window (4–6 days)

Replaces `src/views/Preferences/*`.

**Learn**
- A second window with its **own state type**: `app.window(WindowSpec::new("prefs", prefs_spec).options(hidden))` returns a handle; call `.open()` from the tray or first-launch check
- Sharing data between two windows: `Arc<Mutex<Settings>>` (shared ownership + interior mutability), and why `Rc<RefCell<…>>` won't compile across threads
- `rune-kit` components: `SegmentedControl` (tabs), `Button`, `Switch`, `TextInput`, `Select`, `List`, `Toast`, and `SidebarRow::reorder` (or `.on_drag`) for drag-to-reorder
- `.modal(click_outside, close)` for in-app dialogs, or [`rfd`](https://docs.rs/rfd) for native confirm dialogs like Tauri's `confirm()`
- Running blocking work off the main thread (rescanning `/Applications`, loading icons) with `rune::Latest` or a thread + `AppHandle::update`

**Port, one tab at a time**
1. **General** (`TabGeneral.tsx`):
   - default-browser status + "Set As Default Browser" (Phase 4)
   - "Rescan" (Phase 2, run in the background)
   - "Reset" with a confirmation dialog
   - "Show welcome message"
   - Skip the confetti (or don't — Rune's springs and shapes make a particle burst a fun stretch exercise).
2. **Apps** (`TabApps.tsx`):
   - reorderable list (↑/↓ buttons first, then drag)
   - per-app one-character hotkey input; Backspace/Delete clears it
3. **About** (`TabAbout.tsx`): version from `env!("CARGO_PKG_VERSION")`, Homepage and Issues links (open with your Phase 4 `launch`), "Check for update" (stub until Phase 10).
4. **Welcome modal** (`WelcomeModal.tsx`): shown on first run; dismissing it sets `has_seen_welcome`.
5. Save settings whenever something changes, then tell the picker with its `AppHandle::update` so it picks up new order and hotkeys. Debounce saves so you don't write the file on every keystroke (`tx.wake_after` + a "save due at" time in state).

**Hints**
- Design exercise: should the shared `Settings` live in an `Arc<Mutex<_>>` both windows read, or should prefs *send* changes to the picker with `AppHandle::update` and each window keep its own copy? Try sketching both. The second avoids locks and is closer to how Rune works.

**Done when:** every setting you can change in the Tauri prefs window can be changed here, persists across restarts, and the picker reflects the changes immediately.

---

## Phase 9: Themes (2–4 days, scope it yourself)

Replaces `src/stores/themeDataSlice/*`, `useIsDarkMode.ts`, `ColorPicker.tsx`, `AddThemeSheet.tsx`.

**Learn**
- Rune's theming: `cx.system_dark()` for the OS appearance, `rune::Theme::from_json(src, dark)` for themes as data, and `rune_kit::Kit::from_palette(PaletteSeed { bg, fg, accent })`, which derives every semantic colour from three
- Colour spaces: the TS app stores HSL; Rune works in OKLCH/OKLab. Converting between them is a good small, testable exercise
- `#[derive(Clone)]` vs the TS `JSON.parse(JSON.stringify(...))` deep clones

**Port**
1. Light / Dark / System selection. System follows `cx.system_dark()`; theme switches animate in Rune automatically.
2. Port the Browsernaut gradient (green → purple, `BG_GRADIENT_ACTIVE` in `CONSTANTS.ts`) for the selected picker row (`.linear_gradient(angle, stops)`).
3. **Custom themes, simplified:** instead of 19 editable colour slots with `inherits` / `inheritedFrom` links, let users pick **three seeds** (background, text, accent) and let `Kit::from_palette` derive the rest. This removes the whole inheritance mechanism. Add, rename, delete; store seeds in `Settings`.
4. **Migration:** map each old custom theme's `--background`, `--foreground` and `--primary` to the three seeds.

**Hints**
- If you want the full 19-slot editor anyway, model inheritance as "this slot *is* a reference to that slot" (`enum Slot { Value(Color), Inherit(SlotId) }`) instead of keeping two lists in sync. Ask yourself which version can't get out of sync.

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
   - simplest: "Check for update" fetches the latest GitHub release JSON with `reqwest`/`ureq` (through `rune::Latest`, so the window doesn't block) and opens the download page
5. **CI:** a `publish` workflow on tags that builds, signs, notarizes, and uploads the DMG. Keep the Phase 0 check job, and add your headless UI tests to it on whichever runner the spike's check 6 showed can run them.
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
| 5–6 | ch. 13 again (closures as handlers); ch. 18 (trait objects, for the test launcher); Rune's `crates/rune/README.md`, `examples/hello`, `examples/settings` |
| 7 | ch. 16 (concurrency: threads, `Send`/`Sync`); Rune's "App lifetime" and "Compact tray-controlled windows" sections, `examples/background` |
| 8 | ch. 15 (smart pointers: `Rc`, `RefCell`, `Arc`, `Mutex`); `crates/rune-kit/README.md`, `cargo run -p rune-kit --example shell` |
| 9–10 | Rune's `examples/kit-gallery` for components; read Rune's source when the docs run out |

Optional: Rune has a hot-reload dev loop (`scripts/rune-dev`) that patches view functions while the app runs. It's worth trying once you're in Phases 6–8 and iterating on layout.

## Working with Claude as a tutor

Since the goal is for *you* to write the code, ask in ways that keep it that way:

- "I'm on Phase 2, step 4. Here's my `merge`. **Review it, don't rewrite it.**"
- "Give me a hint, not the answer: why does the borrow checker reject this closure?"
- "Explain this compiler error line by line."
- "What would idiomatic Rust do differently here, and why?"
- "Write tests for my function" (tests are fair game to get help with; they don't take the learning away)

Good luck, and enjoy the borrow checker. It's on your side, eventually. 🦀
