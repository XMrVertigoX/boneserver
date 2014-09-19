#! /bin/bash

git clone https://github.com/jadonk/bonescript.git
npm install --python="/bin/python2" ./bonescript/
rm -r bonescript/
