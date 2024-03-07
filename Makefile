ALL_PROFILES := all,storage,donotstart
export COMPOSE_ENV_FILES ?= .env,.secrets,apps/console/.env,apps/console/.secrets

# Target for running the action
TARGET = $(word 1,$(subst -, ,$*))

export COMPOSE_PROFILES ?= $(TARGET)

check check-%:
	@docker compose config

boot:
	@docker compose up update-certs-helper

up up-%:
	@docker compose up -d
	@docker compose logs -f

ps: export COMPOSE_PROFILES=$(ALL_PROFILES)
ps:
	@docker compose ps

down: export COMPOSE_PROFILES=$(ALL_PROFILES)
down:
	@docker compose down

teardown: export COMPOSE_PROFILES=$(ALL_PROFILES)
teardown:
	@docker compose down -v
