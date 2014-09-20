#! /bin/bash

if [ -z "$1" ]
  then
    echo "No filename supplied"
  else
    gzip -cd $1 | sudo dd bs=4M of=/dev/mmcblk1
fi
