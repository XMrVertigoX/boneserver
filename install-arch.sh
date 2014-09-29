#! /bin/sh

# install required packages
pacman -S --noconfirm ntp base-devel python2 lighttpd vsftpd linux-headers-am33x-legacy nodejs
pacman -U --noconfirm packages/dtc-git-patched-20130410-1-armv7h.pkg packages/haproxy-1.5.3-1-armv7h.pkg.tar.xz

# install some useful packages
pacman -S --noconfirm wget zsh grml-zsh-config
chsh -s /bin/zsh

# update time and set localtime und hostname
ntpdate -u pool.ntp.org
ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime
echo boneserver > /etc/hostname

# link python -> python2
ln -frs /bin/python2 /bin/python

# install node modules
cd node
npm install ws bonescript exec-sync
cd ..

# link config files
ln -sf /opt/boneserver/config/vsftpd/vsftpd.conf /etc/vsftpd.conf
ln -sf /opt/boneserver/config/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg
ln -sf /opt/boneserver/config/lighttpd/lighttpd.conf /etc/lighttpd/lighttpd.conf

# copy service file(s)
cp /opt/boneserver/services/boneserver.service /usr/lib/systemd/system

# enable/start services
systemctl enable lighttpd vsftpd haproxy boneserver ntpd
systemctl start lighttpd vsftpd haproxy boneserver ntpd
