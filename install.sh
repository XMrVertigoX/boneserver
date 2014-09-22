#! /bin/sh

# set system locale
ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime

# install basic software
pacman -S --noconfirm base-devel python2 nodejs lighttpd linux-headers-am33x-legacy vsftpd

# haproxy from local package
pacman -U --noconfirm ./packages/haproxy-1.5.3-1-armv7h.pkg.tar.xz

# link configuration files
ln -sf /bin/python2 /bin/python

mv /etc/lighttpd/lighttpd.conf /etc/lighttpd/lighttpd.conf.old
ln -s /opt/boneserver/config/lighttpd/lighttpd.conf /etc/lighttpd/lighttpd.conf

mv /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg.old
ln -s /opt/boneserver/config/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg

mv /etc/vsftpd.conf /etc/vsftpd.conf.old
ln -s /opt/boneserver/config/vsftpd/vsftpd.conf /etc/vsftpd.conf

# install node modules
cd /node

npm install ws

git -C /tmp clone https://github.com/jadonk/bonescript.git
npm install /tmp/bonescript

cd ..

# link and enable services
ln -s /opt/boneserver/service/boneserver.service /etc/systemd/system/boneserver.service
systemctl enable haproxy lighttpd boneserver
