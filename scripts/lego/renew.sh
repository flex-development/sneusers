#!/bin/sh

# Lego Renew Workflow
#
# Prerequisites:
#
# 1. Run ./scripts/lego/run.sh
#
# Usage:
#
# $ CLOUDSDK_CORE_PROJECT=<gcloud-project-name>
# $ LEGO_ACCOUNT_EMAIL=<email>
# $ TLD=<top-level-domain>
# $ ./scripts/lego.sh
#
# References:
#
# - https://go-acme.github.io/lego/dns/gcloud/

hash_certs() {
  find $LEGO_PATH/certificates -type f -exec python -sBc "import hashlib;print(hashlib.md5(open('{}','rb').read()).hexdigest())" \;
}

LEGO_PATH=./.lego
PRE_HASH=$(hash_certs)

if [ -f "$LEGO_PATH/certificates/_.$TLD.json" ]; then
  # check if certificates need renewal
  if [ "$PRE_HASH" = "$(hash_certs)" ]; then
    echo $LEGO_PATH/certificates/_.$TLD.crt is still valid
    exit 0
  fi

  # renew certificates
  GCE_PROJECT=$CLOUDSDK_CORE_PROJECT lego --accept-tos --dns=gcloud --email=$LEGO_ACCOUNT_EMAIL --path=$LEGO_PATH renew --days=30
fi
