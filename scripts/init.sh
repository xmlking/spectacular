# In repository root
cd "$(dirname $0)/.."

FILE=.env
if [[ -f "$FILE" || -n "$CI" ]]; then
    echo "'$FILE' exists."
else
	cp -n .env.example .env && echo 'Generated: .env'
fi
FILE=apps/console-fb/.env
if [[ -f "$FILE" || -n "$CI" ]]; then
    echo "'$FILE' exists."
else
	cp -n apps/console-fb/.env.example apps/console-fb/.env && echo 'Generated: apps/console/.env'
fi
