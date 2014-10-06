#! /bin/sh

set -e

INPUT="/dev/mmcblk1"
OUTPUT="./backup-$(date +"%s").img"

if [[ ! -z "$1" ]]
	then
		OUTPUT=$1
fi

if [[ ! -r $INPUT ]]
		then
			echo "input file not readable"
			exit 1
fi

if [[ ! -w $OUTPUT ]]
  	then
		echo "output file not writable"
		exit 1
fi

dd bs=4M if=$INPUT | pv | gzip -f > ${OUTPUT}.gz
