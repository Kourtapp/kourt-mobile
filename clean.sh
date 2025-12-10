#!/bin/bash
echo "Cleaning project..."
watchman watch-del-all
rm -rf $TMPDIR/react-*
rm -rf node_modules/
rm -rf ios/Pods/
rm -rf ios/build/
rm -rf ~/Library/Developer/Xcode/DerivedData/Kourt-*
echo "Clean complete."
