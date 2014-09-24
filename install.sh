#! /bin?sh

systemctl stop bonescript.service
systemctl stop bonescript.socket
systemctl stop bonescript-autorun.service
systemctl stop cloud9.service
systemctl stop cloud9.socket

systemctl disable bonescript.service
systemctl disable bonescript.socket
systemctl disable bonescript-autorun.service
systemctl disable cloud9.service
systemctl disable cloud9.socket

service apache2 stop
service apache2 remove

apt-get remove --purge -y apache2 lightdm
apt-get autoremove

tar -xzf package/haproxy-1.5.3.tar.gz -C /tmp
make -C /tmp/haproxy-1.5.3 install TARGET=generic

tar -xzf package/lighttpd-1.4.35.tar.gz -C /tmp

mkdir /var/log/lighttpd
