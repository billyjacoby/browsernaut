use std::{env, fs, os::unix::fs::PermissionsExt, path::Path, process::Command};

use swift_rs::SwiftLinker;

fn main() {
    use_native_swift_build_system();

    SwiftLinker::new("10.15")
        .with_package("Browsernaut", "../swift/Browsernaut")
        .link();

    tauri_build::build()
}

// SwiftPM 6.4+ defaults to the swift-build backend, which outputs to a different
// path and hides swift-rs's exported symbols. swift-rs can't pass extra flags, so
// shim `swift` on PATH to force the native build system for `swift build`.
fn use_native_swift_build_system() {
    let real_swift = Command::new("xcrun")
        .args(["-f", "swift"])
        .output()
        .ok()
        .filter(|o| o.status.success())
        .map(|o| String::from_utf8(o.stdout).unwrap().trim().to_string());
    let Some(real_swift) = real_swift else { return };

    let supports_build_system = Command::new(&real_swift)
        .args(["build", "--help"])
        .output()
        .map(|o| String::from_utf8_lossy(&o.stdout).contains("--build-system"))
        .unwrap_or(false);
    if !supports_build_system {
        return;
    }

    let shim_dir = Path::new(&env::var("OUT_DIR").unwrap()).join("swift-shim");
    fs::create_dir_all(&shim_dir).unwrap();
    let shim = shim_dir.join("swift");
    fs::write(
        &shim,
        format!(
            "#!/bin/sh\nif [ \"$1\" = build ]; then shift; exec \"{real_swift}\" build --build-system native \"$@\"; fi\nexec \"{real_swift}\" \"$@\"\n"
        ),
    )
    .unwrap();
    fs::set_permissions(&shim, fs::Permissions::from_mode(0o755)).unwrap();

    let path = env::var("PATH").unwrap_or_default();
    env::set_var("PATH", format!("{}:{path}", shim_dir.display()));
}
