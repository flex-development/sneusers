#!/bin/zsh

# Certbot x Google Domains
#
# Prerequesites:
#
# 1. Setup a domain using Cloud DNS
#   - https://cloud.google.com/dns/docs/tutorials/create-domain-tutorial
# 2. Install Google Cloud SDK
#   - brew install --cask google-cloud-sdk
# 3. Install certbot
#   - brew install certbot
# 4. Install python (and pip3)
#   - brew install python
# 5. Install certbot-dns-google plugin
#   - pip3 install certbot-dns-google
#   - https://certbot-dns-google.readthedocs.io/en/stable
#
# Usage:
#
# $ EMAIL=<email>
# $ GCLOUD_PROJECT=<project-id>
# $ chmod +x ./tools/scripts/certbot-google-dns.sh
# $ ./tools/scripts/certbot-google-dns.sh
#
# References:
#
# - https://brew.sh
# - https://cloud.google.com/sdk/gcloud/reference/iam/service-accounts
# - https://itsmetommy.com/2019/08/03/auto-renew-lets-encrypt-wildcard-certificate-using-google-cloud-dns
# - http://andrewcmaxwell.com/2014/07/how-to-add-a-custom-subdomain-using-google-cloud-dns

certbot_google_dns() {
  # Service account name
  local NAME=certbot
  GCLOUD_SA_CERTBOT_NAME=$NAME

  # 1. Create certbot service account
  sudo gcloud iam service-accounts create $NAME --project $GCLOUD_PROJECT

  # Service account email
  local SA=$GCLOUD_SA_CERTBOT_NAME@$GCLOUD_PROJECT.iam.gserviceaccount.com
  GCLOUD_SA_CERTBOT=$SA

  # 2. Assign dns admin permissions
  sudo gcloud projects add-iam-policy-binding $GCLOUD_PROJECT --role=roles/dns.admin --member=serviceAccount:$SA

  # Path to private key file
  local PK=~/.service-accounts/google/$GCLOUD_SA_CERTBOT.json
  GCLOUD_SA_CERTBOT_PK=$PK

  # 3. Create private key for service account
  sudo gcloud iam service-accounts keys create $PK --iam-account=$SA

  # 4. Create certificate(s)
  sudo certbot certonly -v -m $EMAIL --dns-google --dns-google-credentials $PK -d $DOMAINS $@
}

certbot_google_dns
