#!/bin/bash

#? The intention with this file is to eventually automate the update of the Homebrew tap 
#? but this can't happen until app builds are able to be completed in a GH action

VERSION=$(yarn app:version)
echo "$VERSION"

export SHA_SUM=($(shasum -a 256 ./src-tauri/target/universal-apple-darwin/release/bundle/dmg/Browsernaut_${VERSION}_universal.dmg))

# HOMEBREW TAP UPDATES
#? Update homebrew tap
sed -i "" "s/version .*/version \"$VERSION\"/g" "./homebrew-browsernaut/Casks/browsernaut.rb"
#? Update homebrew sha 
sed -i "" "s/sha256.*/sha256 \"$SHA_SUM\"/" "./homebrew-browsernaut/Casks/browsernaut.rb"
#? Commit and push changes
cd "./homebrew-browsernaut" && git add .
git commit -m "chore: update version to \"$LATEST_VERSION\""
# git push