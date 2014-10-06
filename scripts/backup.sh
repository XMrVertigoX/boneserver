#! /bin/sh

set -e

INPUT="/dev/mmcblk1"
OUTPUT="./backup-$(date +"%s").img"

while getopts i:o: opt
do
	case $opt in
		i) INPUT=$OPTARG ;;
		o) OUTPUT=$OPTARG ;;
	esac
done

if [[ ! -r $INPUT ]]
		then
			echo "input file not readable"
			exit 1
fi

if [[ -a $OUTPUT ]]
  	then
		echo "output file already exists"
		exit 1
fi

dd bs=4M if=$INPUT | pv | gzip -f > ${OUTPUT}.gz
