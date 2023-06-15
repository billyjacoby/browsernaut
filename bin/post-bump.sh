#!/bin/bash

##? Version has been bumped, so we should create a build here then update the 
##? updates.json file with the tar.gz.sig provided. Have to figure out how to target the previous version number here though

echo "Building release..."
yarn build:release

export UPDATE_SIG_FILE="./src-tauri/target/release/bundle/macos/Browsernaut.app.tar.gz.sig"
export UPDATE_SIG=$(cat $UPDATE_SIG_FILE)

export SHA_SUM=shasum -a 256 "./src-tauri/target/release/bundle/dmg/Browsernaut_$VERSION_x64.dmg"

export PUBLISH_DATE=$(date -u -Iseconds | sed s/+00:00/Z/ | sed s/,/./)

echo "Updating updates file"

#? Update the version
sed -i "" "s/$LATEST_VERSION/$VERSION/g" "./updates.json"
#? Update the signature 
sed -i "" "s/\"signature\":.*/\"signature\": \"$UPDATE_SIG\",/" "./updates.json"
#? Update the publish date 
sed -i "" "s/\"pub_date\":.*/\"pub_date\": \"$PUBLISH_DATE\",/" "./updates.json"

## HOMEBREW TAP UPDATES
#? Update homebrew tap
sed -i "" "s/$LATEST_VERSION/$VERSION/g" "./homebrew-browsernaut/Casks/browsernaut.rb"
#? Update homebrew sha 
sed -i "" "s/sha256:.*/\"sha256:\": \"$SHA_SUM\",/" "./homebrew-browsernaut/Casks/browsernaut.rb"
#? Commit and push changes
cd "./homebrew-browsernaut" && git add . && git commit -m "chore: update version to \"$LATEST_VERSION\""


echo "Complete!"