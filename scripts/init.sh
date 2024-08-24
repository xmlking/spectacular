#!/bin/bash

# In repository root
cd "$(dirname $0)/.."

###------Root--------###

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

FILE=.env.production
if [[ -f "$FILE" || -n "$CI" ]]; then
    echo "'$FILE' exists."
else
	cp -n .env.production.example .env.production && echo 'Generated: .env.production, FIXIT'
fi

FILE=.secrets.production
if [[ -f "$FILE" || -n "$CI" ]]; then
    echo "'$FILE' exists."
else
	cp -n .secrets.production.example .secrets.production && echo 'Generated: .secrets.production, FIXIT'
fi
