#! /bin/sh

# Original posted on August 15, 2013 by Owen
# http://www.embedded-things.com/bbb/patching-the-device-tree-compiler-for-ubuntu/
# 
# Modified by Caspar Friedrich

git clone http://jdl.com/software/dtc.git/
cd dtc
git reset --hard f8cb5dd94903a5cfa1609695328b8f1d5557367f
wget https://patchwork.kernel.org/patch/1934471/raw/ -O dynamic-symbols.patch
git apply dynamic-symbols.patch
make
