VERSION=unknown

STAGING_DIR=/srv/preware/build/staging/i686
CC=/srv/preware/build/toolchain/i686-unknown-linux-gnu/build/i686-unknown-linux-gnu/bin/i686-unknown-linux-gnu-gcc

# STAGING_DIR=/srv/preware/build/staging/armv7
# CC=/opt/PalmPDK/arm-gcc/bin/arm-none-linux-gnueabi-gcc

CPPFLAGS := -g -DVERSION=\"${VERSION}\" -I${STAGING_DIR}/usr/include/glib-2.0 -I${STAGING_DIR}/usr/lib/glib-2.0/include -I${STAGING_DIR}/usr/include
LDFLAGS  := -g -L${STAGING_DIR}/usr/lib -llunaservice -lmjson -lglib-2.0

govnah: govnah.o luna_service.o luna_methods.o

install: govnah
	- ssh root@webos killall org.webosinternals.govnah
	scp govnah root@webos:/var/usr/sbin/org.webosinternals.govnah.new
	ssh root@webos mv /var/usr/sbin/org.webosinternals.govnah.new /var/usr/sbin/org.webosinternals.govnah

clobber:
	rm -rf *.o govnah
