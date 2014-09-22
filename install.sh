#! /bin/sh

# basic software
pacman -S --noconfirm base-devel python2 nodejs ntp git lighttpd linux-headers-am33x-legacy vsftpd

# haproxy from local package
pacman -U /opt/boneserver/packages/haproxy-1.5.3-1-armv7h.pkg.tar.xz

# Link configuration files
ln -s /bin/python2 /bin/python

mv /etc/lighttpd/lighttpd.conf /etc/lighttpd/lighttpd.conf.old
ln -sf /opt/boneserver/config/lighttpd/lighttpd.conf /etc/lighttpd/lighttpd.conf

mv /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg.old
ln -sf /opt/boneserver/config/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg

mv /etc/vsftpd.conf /etc/vsftpd.conf.old
ln -sf /opt/boneserver/config/vsftpd/vsftpd.conf /etc/vsftpd.conf
