#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail
set -o errtrace

PRODUCT=mailpit
if [[ "$#" -lt 1 ]]; then
	echo "Usage: $0 SAN [SAN...]"
	echo
	echo "Example: $0 mailpit"
	echo
	echo "The following files will be created under ./certs"
	echo "- certs/{ca.pem,cert.pem,key.pem}"
	echo "- SAN"
	exit 1
fi
if ! command -v mkcert >/dev/null; then
	echo "Missing mkcert (https://github.com/FiloSottile/mkcert)"
	exit 1
fi
SAN=$@

(
	mkdir -p certs
	CAROOT=$(pwd) mkcert -cert-file certs/tls.crt -key-file certs/tls.key ${SAN} >/dev/null 2>&1
	cp -f rootCA.pem certs/ca.pem
	rm -f rootCA.pem rootCA-key.pem
)
