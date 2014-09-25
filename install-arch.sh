#! /bin/sh

# install required packages
pacman -S --noconfirm ntp base-devel python2 lighttpd vsftpd linux-headers-am33x-legacy
pacman -U packages/haproxy-1.5.3-1-armv7h.pkg.tar.xz

# update time and set localtime
ntpdate -u pool.ntp.org
ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime

# link config files
ln -sf /opt/boneserver/config/vsftpd/vsftpd.conf /etc/vsftpd.conf
systemctl start vsftpd
systemctl enable vsftpd
