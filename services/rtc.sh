#! /bin/sh

# GND	pin 1 or 2
# VCC	pin 3 or 4
# SCL	pin 19 (I2C2)
# SDA	pin 20 (I2C2)

echo ds3231 0x68 > /sys/bus/i2c/devices/i2c-1/new_device

hwclock -s -f /dev/rtc1
hwclock -w -f /dev/rtc0
