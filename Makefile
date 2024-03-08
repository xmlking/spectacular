# NOTE: keep adding any new profiles here:
ALL_PROFILES := all,storage,donotstart
export COMPOSE_ENV_FILES ?= .env,.secrets,apps/console/.env,apps/console/.secrets

# Target for running the action
TARGET = $(word 1,$(subst -, ,$*))

# set profiles for all commands if provided.
export COMPOSE_PROFILES ?= $(PROFILES)

# will print resolved `compose config` with applied profiles and .env/.secrets
check:
	@docker compose config

# run this for the first time or after removing volumes with `teardown` task
boot:
	@docker compose up update-certs-helper

# run all services for active profiles or run single service if TARGET specified.
up up-%:
	@if [ -z $(TARGET) ]; then \
		docker compose up -d && docker compose logs -f ; \
	else \
		docker compose up -d $(TARGET) && docker compose logs -f $(TARGET); \
	fi

# show logs of all running services or single service if TARGET specified
logs logs-%:
	@if [ -z $(TARGET) ]; then \
    	docker compose logs -f ; \
	else \
	    docker compose logs -f $(TARGET) ; \
	fi

# show status of all running services for all `profiles`
ps: export COMPOSE_PROFILES=$(ALL_PROFILES)
ps:
	@docker compose ps

# stop all services for all `profiles`
down down-%:
	@if [ -z $(TARGET) ]; then \
    	COMPOSE_PROFILES=$(ALL_PROFILES) docker compose down ; \
	else \
	    docker compose down $(TARGET) ; \
	fi

# stop all services for all `profiles` and remove all volumes
teardown: export COMPOSE_PROFILES=$(ALL_PROFILES)
teardown:
	@docker compose down -v
