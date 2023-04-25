use swift_rs::SwiftLinker;

fn main() {
    SwiftLinker::new("10.15")
        .with_package("Browsernaut", "../swift/Browsernaut")
        .link();

    tauri_build::build()
}
