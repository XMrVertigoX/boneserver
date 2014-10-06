#! /bin/sh

set -e

OUTPUT="/dev/mmcblk1"

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

gzip -cd $INPUT | pv | dd bs=4M of=$OUTPUT
