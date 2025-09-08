
include client/Makefile
include server/Makefile

.PHONY: bootstrap dev dev-client dev-server control-server-dev interaction-server-dev

bootstrap:
	$(MAKE) -C client bootstrap
	$(MAKE) -C server bootstrap

dev:
	$(MAKE) -C client dev-client & \
	$(MAKE) -C server control-server-dev & \
	$(MAKE) -C server interaction-server-dev

dev-client:
	$(MAKE) -C client dev-client

dev-server:
	$(MAKE) -C server control-server-dev & \
	$(MAKE) -C server interaction-server-dev
