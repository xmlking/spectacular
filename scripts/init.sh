# In repository root
cd "$(dirname $0)/.."

FILE=.env
if [[ -f "$FILE" || -n "$CI" ]]; then
    echo "'$FILE' exists."
else
	cp -n .env.example .env && echo 'Generated: .env'
fi
FILE=apps/console/.env
if [[ -f "$FILE" || -n "$CI" ]]; then
    echo "'$FILE' exists."
else
	cp -n apps/console/.env.example apps/console/.env && echo 'Generated: apps/console/.env'
fi
