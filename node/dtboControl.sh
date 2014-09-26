#! /bin/sh

bone_capemgr=$(find /sys/devices/ -name bone_capemgr.*)

case $1 in
	disable)
		echo -$2 > $bone_capemgr/slots ;;
	enable)
		echo $2 > $bone_capemgr/slots ;;
	slots)
		cat $bone_capemgr/slots ;;
	*)
		echo "unknown case" ;;
esac
