#! /bin/bash

git -C /tmp clone https://github.com/jadonk/bonescript.git
npm install /tmp/bonescript/
rm -r /tmp/bonescript/
