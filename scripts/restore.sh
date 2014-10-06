#! /bin/sh

set -e

OUTPUTFILE="/dev/mmcblk1"

if [[ ! -z "$1" ]]
	then
		INPUTFILE=$1
fi

if [[ ! -r $INPUTFILE ]]
		then
			echo "file not readable"
			exit 1
fi

gzip -cd $INPUTFILE | pv | dd bs=4M of=$OUTPUTFILE
