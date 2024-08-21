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

FILE=.env.prod
if [[ -f "$FILE" || -n "$CI" ]]; then
    echo "'$FILE' exists."
else
	cp -n .env.prod.example .env.prod && echo 'Generated: .env.prod, FIXIT'
fi

FILE=.secrets.prod
if [[ -f "$FILE" || -n "$CI" ]]; then
    echo "'$FILE' exists."
else
	cp -n .secrets.prod.example .secrets.prod && echo 'Generated: .secrets.prod, FIXIT'
fi
