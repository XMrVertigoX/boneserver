# Scripts
Some useful shell scripts

## Maintaining

### backup.sh
Mirrors the whole eMMC using _pv_.

	backup.sh [output directory]

### restore.sh
Restores a disk image to the eMMC using _pv_.

	resore.sh <input file>

## Tools

### display.sh
Turns off the display shutdown. Nice for reading debug output.

### push.sh
Pushes the whole repository to a given host using rsync. Excludes data and backup files (push-exclude.list)

	push.sh <host>
