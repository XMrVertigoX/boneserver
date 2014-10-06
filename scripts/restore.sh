#! /bin/sh

set -e

OUTPUT="/dev/mmcblk1"

if [[ ! -z "$1" ]]
	then
		INPUT=$1
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

gzip -cd $INPUT | pv | dd bs=4M of=$OUTPUT
