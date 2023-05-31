// swift-tools-version: 5.7.1
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "Browsernaut",
    platforms: [
        .macOS(.v10_15 /* macOS Catalina */), // This specifies the earliest version of macOS that is supported.
    ],
    products: [
        // Products define the executables and libraries a package produces, and make them visible to other packages.
        .library(
            name: "Browsernaut",
            type: .static,
            targets: ["Browsernaut"])
    ],
    dependencies: [
        .package(url: "https://github.com/Brendonovich/swift-rs", from: "1.0.5")
        // Dependencies declare other packages that this package depends on.
        // .package(url: /* package url */, from: "1.0.0"),
    ],
    targets: [
        // Targets are the basic building blocks of a package. A target can define a module or a test suite.
        // Targets can depend on other targets in this package, and on products in packages this package depends on.
        .target(
            name: "Browsernaut",
            dependencies: [.product(name: "SwiftRs", package: "swift-rs")],
            path: "src"
        ),
        
    ]
)
