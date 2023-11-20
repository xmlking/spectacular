# In repository root
cd "$(dirname $0)/.."

cp -n .env.example .env && echo 'Generated: .env'
# ln -sf "$(pwd)/.env" apps/web/.env && echo 'Linked: apps/web/.env'
FILE=apps/web/.env
if [ -f "$FILE" ]; then
    echo "$FILE exists."
else
	ln -s "$(pwd)/.env" apps/web/.env && echo 'Linked: apps/web/.env'
fi
