#!/bin/zsh

# Certbot x Google Cloud DNS
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
# 6. Create service account for certbot
#   - sudo gcloud iam service-accounts create certbot --project $GCLOUD_PROJECT
# 7. Assign dns admin permissions to certbot service account
#   - SA=certbot@$GCLOUD_PROJECT.iam.gserviceaccount.com
#   - sudo gcloud projects add-iam-policy-binding $GCLOUD_PROJECT
#     --role=roles/dns.admin --member=serviceAccount:$SA
#
# Usage:
#
# CERTBOT_EMAIL=<email>
# GCLOUD_DOMAINS=<certbot-domains-list>
# GCLOUD_PROJECT=<project-id>
# GCLOUD_SA_CERTBOT=<certbot-service-account-email>
# GCLOUD_SA_CERTBOT_PK=<path-to-cerbot-service-account-file>
# $ chmod +x ./tools/scripts/certbot-google-dns.sh
# $ ./tools/scripts/certbot-google-dns.sh
#
# References:
#
# - https://brew.sh
# - https://certbot.eff.org/renewal-setup
# - https://cloud.google.com/sdk/gcloud/reference/iam/service-accounts
# - https://itsmetommy.com/2019/08/03/auto-renew-lets-encrypt-wildcard-certificate-using-google-cloud-dns
# - http://andrewcmaxwell.com/2014/07/how-to-add-a-custom-subdomain-using-google-cloud-dns

certbot_google_dns() {
  local DOMAINS=$GCLOUD_DOMAINS
  local EMAIL=$CERTBOT_EMAIL
  local PK=$GCLOUD_SA_CERTBOT_PK
  local SA=$GCLOUD_SA_CERTBOT

  # 1. Create private key for service account
  [ ! -f $PK ] && gcloud iam service-accounts keys create $PK --iam-account=$SA

  # 2. Create certificate(s)
  sudo certbot certonly --dns-google --dns-google-credentials $PK -d $DOMAINS -m $EMAIL -v $@

  # 3. Fix permissions
  sudo chmod 0755 /etc/letsencrypt/{live,archive}
  sudo chgrp -R staff /etc/letsencrypt/live/$TLD/privkey.pem
  sudo chmod 0755 /etc/letsencrypt/live/$TLD/privkey.pem
}

certbot_google_dns
