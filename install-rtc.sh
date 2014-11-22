#! /bin/sh

set -e

cp services/rtc.sh /lib/systemd/scripts
cp services/rtc.service /lib/systemd/system

systemctl daemon-reload
systemctl start rtc
systemctl enable rtc