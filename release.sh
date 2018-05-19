#!/bin/bash

rm -rf ./build/web-mobile
/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path "./" --build
gulp
