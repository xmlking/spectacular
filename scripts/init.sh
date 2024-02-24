#!/bin/bash

# In repository root
cd "$(dirname $0)/.."

FILE=.env
if [[ -f "$FILE" || -n "$CI" ]]; then
    echo "'$FILE' exists."
else
	cp -n .env.example .env && echo 'Generated: .env, FIXIT'
fi

FILE=.secrets
if [[ -f "$FILE" || -n "$CI" ]]; then
    echo "'$FILE' exists."
else
	cp -n .secrets.example .secrets && echo 'Generated: .secrets, FIXIT'
fi

FILE=apps/console-fb/.env
if [[ -f "$FILE" || -n "$CI" ]]; then
    echo "'$FILE' exists."
else
	cp -n apps/console-fb/.env.example apps/console-fb/.env && echo 'Generated: apps/console-fb/.env, FIXIT'
fi

FILE=apps/console-fb/.secrets
if [[ -f "$FILE" || -n "$CI" ]]; then
    echo "'$FILE' exists."
else
	cp -n apps/console-fb/.secrets.example apps/console-fb/.secrets && echo 'Generated: apps/console-fb/.secrets, FIXIT'
fi

FILE=apps/console/.env
if [[ -f "$FILE" || -n "$CI" ]]; then
    echo "'$FILE' exists."
else
	cp -n apps/console/.env.example apps/console/.env && echo 'Generated: apps/console/.env, FIXIT'
fi

FILE=apps/console/.secrets
if [[ -f "$FILE" || -n "$CI" ]]; then
    echo "'$FILE' exists."
else
	cp -n apps/console/.secrets.example apps/console/.secrets && echo 'Generated: apps/console/.secrets, FIXIT'
fi
