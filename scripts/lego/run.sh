#!/bin/sh

set -e

# Lego - Run Workflow
#
# Prerequisites:
#
# setup domain using cloud dns: https://cloud.google.com/dns/docs/tutorials/create-domain-tutorial
# brew install --cask google-cloud-sdk
# export CLOUDSDK_CORE_PROJECT=<project-name>
# export CLOUDSDK_CORE_ACCOUNT=$CLOUDSDK_CORE_PROJECT@$CLOUDSDK_CORE_PROJECT.iam.gserviceaccount.com
# export GCE_SERVICE_ACCOUNT_FILE=./.service-accounts/$CLOUDSDK_CORE_ACCOUNT.json
# export IAM_POLICY_MEMBER=serviceAccount:$CLOUDSDK_CORE_ACCOUNT
# gcloud iam service-accounts create $CLOUDSDK_CORE_PROJECT
# gcloud projects add-iam-policy-binding --member=$IAM_POLICY_MEMBER --role=roles/dns.admin
# CLOUDSDK_PYTHON=python2 gcloud iam service-accounts keys create $GCE_SERVICE_ACCOUNT_FILE \
#   --iam-account=$CLOUDSDK_CORE_ACCOUNT
#
# Usage:
#
# export CLOUDSDK_CORE_PROJECT=<project-name>
# export CLOUDSDK_CORE_ACCOUNT=$CLOUDSDK_CORE_PROJECT@$CLOUDSDK_CORE_PROJECT.iam.gserviceaccount.com
# export GCE_SERVICE_ACCOUNT_FILE=./.service-accounts/$CLOUDSDK_CORE_ACCOUNT.json
# export LEGO_ACCOUNT_EMAIL=<email>
# export LEGO_PATH=[lego-folder-path]
# export SUBDOMAINS=[subdomains-list]
# export TLD=<top-level-domain>
# bash ./scripts/lego/run.sh
#
# References:
#
# - https://cloud.google.com/sdk/gcloud/reference/projects/add-iam-policy-binding
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

# create certificate if certificate does not already exist
if [ ! -f "$LEGO_PATH/certificates/_.$TLD.json" ]; then
  LEGO_DOMAIN_OPTS=''

  # get domain options
  for domain in $(echo *.$TLD,$SUBDOMAINS | tr "," "\n"); do
    LEGO_DOMAIN_OPTS="$LEGO_DOMAIN_OPTS --domains=$domain"
  done

  # create certificate for $TLD and $SUBDOMAINS
  GCE_PROJECT=$CLOUDSDK_CORE_PROJECT lego \
    $LEGO_DOMAIN_OPTS \
    --accept-tos \
    --dns=gcloud \
    --email=$LEGO_ACCOUNT_EMAIL \
    --key-type=rsa4096 \
    --path=$LEGO_PATH \
    run
fi

# copy lego folder to project storage bucket
gcloud storage cp --recursive $LEGO_PATH gs://$CLOUDSDK_CORE_PROJECT/app/$LEGO_PATH
