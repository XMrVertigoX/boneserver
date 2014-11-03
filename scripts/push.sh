#! /bin/sh

rsync -avz --delete --no-o --no-g --exclude-from='push-exclude.list' ../ root@${1}:/opt/boneserver
