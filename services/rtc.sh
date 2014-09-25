#! /bin/sh

echo ds3231 0x68 > /sys/bus/i2c/devices/i2c-1/new_device

hwclock -s -f /dev/rtc1
hwclock -w -f /dev/rtc0
