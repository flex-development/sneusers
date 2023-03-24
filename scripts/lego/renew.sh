#!/bin/sh

# Lego - Renew Workflow
#
# Prerequisites:
#
# bash ./scripts/lego/run.sh
#
# Usage:
#
# export CLOUDSDK_CORE_PROJECT=<project-name>
# export CLOUDSDK_CORE_ACCOUNT=$CLOUDSDK_CORE_PROJECT@$CLOUDSDK_CORE_PROJECT.iam.gserviceaccount.com
# export GCE_SERVICE_ACCOUNT_FILE=./.service-accounts/$CLOUDSDK_CORE_ACCOUNT.json
# export LEGO_ACCOUNT_EMAIL=<email>
# export LEGO_PATH=[lego-folder-path]
# export TLD=<top-level-domain>
# bash ./scripts/lego/renew.sh
#
# References:
#
# - https://cloud.google.com/sdk/gcloud/reference/storage/cp
# - https://go-acme.github.io/lego/dns/gcloud

# ensure CLOUDSDK_CORE_PROJECT is set and non-empty
[[ -z "${CLOUDSDK_CORE_PROJECT}" ]] && echo "\$CLOUDSDK_CORE_PROJECT required." && exit 1

# ensure LEGO_ACCOUNT_EMAIL is set and non-empty
[[ -z "${LEGO_ACCOUNT_EMAIL}" ]] && echo "\$LEGO_ACCOUNT_EMAIL required." && exit 1

# ensure TLD is set and non-empty
[[ -z "${TLD}" ]] && echo "\$TLD required." && exit 1

# lego folder path
LEGO_PATH=${LEGO_PATH:-.lego}

# create unique hash for comparing certificates
hash_certs() {
  find $LEGO_PATH/certificates -type f -exec python -sBc "import hashlib;print(hashlib.md5(open('{}','rb').read()).hexdigest())" \;
}

# initial certificates hash
PRE_HASH=$(hash_certs)

# try renewing certificate if possible stale certificate exists
if [ -f "$LEGO_PATH/certificates/_.$TLD.json" ]; then
  # check if certificate needs renewal
  if [ "$PRE_HASH" = "$(hash_certs)" ]; then
    echo $LEGO_PATH/certificates/_.$TLD.crt is still valid
    exit 0
  fi

  # renew certificate
  GCE_PROJECT=$CLOUDSDK_CORE_PROJECT lego \
    --accept-tos \
    --dns=gcloud \
    --email=$LEGO_ACCOUNT_EMAIL \
    --path=$LEGO_PATH \
    renew --days=30
fi

# copy lego folder to project storage bucket
gcloud storage cp --recursive $LEGO_PATH gs://$CLOUDSDK_CORE_PROJECT/app/$LEGO_PATH
