#! /bin/sh

set -e

INPUTFILE="/dev/mmcblk1"
OUTPUTDIRECTORY="./"

if [[ ! -z "$1" ]]
	then
		OUTPUTDIRECTORY=$1
fi

if [[ ! -d $OUTPUTDIRECTORY ]]
	then
		echo "not a directory"
		exit 1
fi

dd bs=4M if=$INPUTFILE | pv | gzip -f > ${OUTPUTDIRECTORY}/backup-$(date +"%s").img.gz
