#! /bin/sh

ocp=$(find /sys/devices/ -name ocp.*)
prefix="pwm_test_"
pwms=$(find $ocp -name $prefix*)

case $1 in
	ls)
		echo $(ls $ocp/$prefix$2*);;
	path)
		echo $ocp/$prefix$2* ;;

	get_duty)
		cat $2/duty ;;
	set_duty)
		echo $2 > $3/duty ;;

	get_period)
		cat $2/period ;;
	set_period)
		echo $2 > $3/period ;;

	get_polarity)
		cat $2/polarity ;;
	set_polarity)
		echo $2 > $3/polarity ;;

	get_run)
		cat $2/run ;;
	set_run)
		echo $2 > $3/run ;;
		
	*)
		echo "unknown case" ;;
esac
