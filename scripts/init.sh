# In repository root
cd "$(dirname $0)/.."

# cp -n .env.example .env && echo 'Generated: .env'
# cp -n apps/console/.env.example apps/console/.env && echo 'Generated: apps/console/.env'
FILE=.env
if [[ -f "$FILE" || "$CI" == "true" ]]; then
    echo "'$FILE' exists."
else
	cp -n .env.example .env && echo 'Generated: .env'
fi
FILE=apps/web/.env
if [[ -f "$FILE" || "$CI" == "true" ]]; then
    echo "'$FILE' exists."
else
	cp -n apps/console/.env.example apps/console/.env && echo 'Generated: apps/console/.env'
fi
