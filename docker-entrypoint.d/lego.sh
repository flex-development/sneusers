#!/bin/sh

set -e

# Lego Run Workflow
#
# Prerequisites:
#
# 1. Setup a domain using Cloud DNS
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
# References:
#
# - https://go-acme.github.io/lego/dns/gcloud/

if [ ! -f "$LEGO_PATH/certificates/_.$TLD.json" ]; then
  LEGO_DOMAIN_OPTS=''

  # get domain options
  for domain in $(echo $LEGO_DOMAINS | tr "," "\n"); do
    LEGO_DOMAIN_OPTS="$LEGO_DOMAIN_OPTS --domains=$domain"
  done

  # create certificates
  GCE_PROJECT=$CLOUDSDK_CORE_PROJECT lego --accept-tos --dns=gcloud --email=$LEGO_ACCOUNT_EMAIL $LEGO_DOMAIN_OPTS --path=$LEGO_PATH run
fi
