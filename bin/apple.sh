#!/bin/bash
# targets=("x86_64-apple-darwin" "aarch64-apple-darwin" "universal-apple-darwin");

# target=${targets[$1]};

app_path="src-tauri/target/release/bundle/macOS/Browsernaut.app";
app_path_dev="src-tauri/target/release/bundle/macOS/Browsernaut-dev.app";

sign_app=$SIGN_APP;
sign_app_dev=$SIGN_APP_DEV;

sign_install=$SIGN_INSTALL;

build_name="src-tauri/target/release/bundle/macOS/Browsernaut.pkg";

profile="src-tauri/entitlements/embedded.provisionprofile";
profile_dev="src-tauri/entitlements/dev/embedded.provisionprofile";

cp_dir="src-tauri/target/release/bundle/macOS/Browsernaut.app/Contents/";
cp_dir_dev="src-tauri/target/release/bundle/macOS/Browsernaut-dev.app/Contents/";

yarn run build:release;
cp -r "${app_path}" "${app_path_dev}"
cp "${profile}" "${cp_dir}";
cp "${profile_dev}" "${cp_dir_dev}";

codesign --force -s "${sign_app}" --entitlements ./src-tauri/entitlements.mac.plist "${app_path}";
codesign --force -s "${sign_app_dev}" --entitlements ./src-tauri/entitlements.mac.plist "${app_path_dev}";

productbuild --component "${app_path}" /Applications/ --sign "${sign_install}" "${build_name}";

# xcrun altool --upload-package "${build_name}" -u billyjacoby@gmail.com -p mcnu-xutf-ivow-jnbw --apple-id billyjacoby@gmail.com --bundle-id com.billyjacoby.browsernaut --type macos

# xcrun altool --upload-package "${build_name}" --type "macos" --apple-id billyjacoby@gmail.com --bundle-version 0.0.1 --bundle-short-version-string 0.0.1 --bundle-id "com.billyjacoby.browsernaut" --apiKey NA6F6JFRVS --apiIssuer d7ba8907-7a6c-4978-ae30-62ab9117cd71