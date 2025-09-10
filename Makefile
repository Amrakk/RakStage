include client/Makefile
include server/Makefile

.PHONY: bootstrap dev dev-client dev-server client-bootstrap server-bootstrap client-dev-client server-control-server-dev server-interaction-server-dev env-init restore-env

env-init:
	$(MAKE) -C client env-init
	$(MAKE) -C server server-env-init

restore-env:
	$(MAKE) -C client restore-env
	$(MAKE) -C server server-restore-env

bootstrap:
	$(MAKE) -C client client-bootstrap
	$(MAKE) -C server server-bootstrap

dev:
	$(MAKE) -C client client-dev-client & \
	$(MAKE) -C server server-control-server-dev & \
	$(MAKE) -C server server-interaction-server-dev

dev-client:
	$(MAKE) -C client client-dev-client

dev-server:
	$(MAKE) -C server server-control-server-dev & \
	$(MAKE) -C server server-interaction-server-dev
