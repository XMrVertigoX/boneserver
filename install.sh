#! /bin?sh

systemctl stop bonescript.service bonescript.socket bonescript-autorun.service
systemctl disable bonescript.service bonescript.socket bonescript-autorun.service

apt-get autoremove -y apache2 lightdm

tar -xzf packages/haproxy-1.5.3.tar.gz -C /tmp
tar -xzf packages/lighttpd-1.4.35.tar.gz -C /tmp
