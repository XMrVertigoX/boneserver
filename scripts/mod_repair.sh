chown -R 0:0 ./

find ./ -type d | xargs chmod 755
find ./ -type f | xargs chmod 644

chmod 755 mod_repair.sh
