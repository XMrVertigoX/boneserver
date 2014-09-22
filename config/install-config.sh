#! /bin/sh

mv /etc/lighttpd/lighttpd.conf /etc/lighttpd/lighttpd.conf.old
ln -s /opt/boneserver/config/lighttpd/lighttpd.conf /etc/lighttpd/lighttpd.conf
