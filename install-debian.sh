#! /bin/sh

# uptade time and set localtime
ntpdate -u pool.ntp.org
ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime

# initial upgrades
apt-get update
apt-get upgrade -y
apt-get autoremove -y

# clone into git repo
git clone https://github.com/XMrVertigoX/boneserver.git /opt/boneserver
cd /opt/boneserver

# apache2
apt-get remove apache2
apt-get remove apache2-mpm-worker

# stop and remove bonscript website and cloud9
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

tar -xzf packages/haproxy-1.5.3.tar.gz -C /tmp
cd /tmp/haproxy-1.5.3
make TARGET=linux2628 USE_PCRE=1 USE_OPENSSL=1 USE_ZLIB=1 clean all
make install
cd /opt/boneserver

tar -xzf package/lighttpd-1.4.35.tar.gz -C /tmp

npm install -g ws
