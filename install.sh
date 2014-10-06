#! /bin/sh

set -e

# install or update required packages
pacman -S --noconfirm --needed ntp base-devel python2 lighttpd vsftpd linux-headers-am33x-legacy nodejs
pacman -U --noconfirm --needed packages/dtc-git-patched-20130410-1-armv7h.pkg.tar.xz packages/haproxy-1.5.3-1-armv7h.pkg.tar.xz

# install some useful packages if not already up to date
pacman -S --noconfirm --needed wget zsh grml-zsh-config wpa_supplicant pv
chsh -s /bin/zsh

# update time and set localtime und hostname
ntpdate -u pool.ntp.org
ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime
echo boneserver > /etc/hostname

# link python -> python2
ln -frs /bin/python2 /bin/python

# install node modules
cd node
npm install bonescript shelljs ws
cd ..

# link config file(s)
ln -sf /opt/boneserver/config/vsftpd/vsftpd.conf /etc/vsftpd.conf
ln -sf /opt/boneserver/config/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg
ln -sf /opt/boneserver/config/lighttpd/lighttpd.conf /etc/lighttpd/lighttpd.conf

# copy service file(s)
cp /opt/boneserver/services/boneserver.service /usr/lib/systemd/system

# enable and start services
systemctl enable lighttpd vsftpd haproxy boneserver ntpd
systemctl start lighttpd vsftpd haproxy boneserver ntpd

reboot
