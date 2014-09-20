#! /bin/bash

if [ -z "$1" ]
  then
    echo "No filename supplied"
  else
    sudo dd bs=4M if=/dev/mmcblk1 | gzip -f > "$1.gz"
fi
