#!/bin/sh

# Lego Renew Workflow
#
# Prerequisites:
#
# 1. Run ./scripts/lego/run.sh
#   - https://cloud.google.com/dns/docs/tutorials/create-domain-tutorial
# 2. Install Google Cloud SDK
#   - brew install --cask google-cloud-sdk
# 3. CLOUDSDK_CORE_PROJECT=<project-name>
# 4. GCE_IAM_ACCOUNT=letsencrypt@$CLOUDSDK_CORE_PROJECT.iam.gserviceaccount.com
# 5. GCE_SERVICE_ACCOUNT_FILE=~/.service-accounts/google/$GCE_IAM_ACCOUNT.json
# 6. Create service account
#   - gcloud iam service-accounts create letsencrypt
#     --description=https://go-acme.github.io/lego/dns/gcloud --display-name=letsencrypt
# 7. Assign dns admin permissions to service account
#   - CLOUDSDK_PYTHON=python2 gcloud projects add-iam-policy-binding $CLOUDSDK_CORE_PROJECT
#     --member=serviceAccount:$GCE_IAM_ACCOUNT --role=roles/dns.admin
# 8. Create private key for service account
#   - gcloud iam service-accounts keys create $GCE_SERVICE_ACCOUNT_FILE
#     --iam-account=$GCE_IAM_ACCOUNT
#
# Usage:
#
# $ CLOUDSDK_CORE_PROJECT=<gcloud-project-name>
# $ GCE_SERVICE_ACCOUNT_FILE=<path-to-service-account>
# $ LEGO_ACCOUNT_EMAIL=<email>
# $ LEGO_PATH=<path-to-lego-folder>
# $ TLD=<top-level-domain>
# $ ./scripts/lego.sh
#
# References:
#
# - https://go-acme.github.io/lego/dns/gcloud/

hash_certs() {
  find $LEGO_PATH/certificates -type f -exec python -sBc "import hashlib;print(hashlib.md5(open('{}','rb').read()).hexdigest())" \;
}

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
