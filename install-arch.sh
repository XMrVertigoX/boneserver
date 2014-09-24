#! /bin/sh

ntpdate -u pool.ntp.org
ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime

pacman -S --noconfirm base-devel paython2 lighttpd vsftpd linux-am33x-headers