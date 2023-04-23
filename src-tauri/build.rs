use std::path::Path;

use swift_rs::SwiftLinker;

fn main() {
    SwiftLinker::new("10.15")
        .with_package("Browsernaut", Path::new("../swift/Browsernaut"))
        .link();

    tauri_build::build()
}
