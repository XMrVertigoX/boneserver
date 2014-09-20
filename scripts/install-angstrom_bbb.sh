#! /bin/bash

wget -N http://s3.armhf.com/boards/bbb/bbb_angstrom_ga.img.xz
xz -cd bbb_angstrom_ga.img.xz > /dev/mmcblk1
