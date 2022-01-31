#!/bin/zsh

# Certbot x Google Cloud DNS
#
# Usage:
#
# $ chmod +x ./tools/scripts/certbot.sh
# $ CERTBOT_DOMAINS=<certbot-domains-list>
# $ CERTBOT_EMAIL=<certbot-email>
# $ VM_IDENTITY_FILE=<path-to-scp-identify-file>
# $ VM_IP=<vm-ip-address>
# $ VM_USER=<vm-ip-address>
# $ ./tools/scripts/certbot.sh

certbot() {
  local CERTBOT_DIR=/etc/letsencrypt
  local DOMAINS=$CERTBOT_DOMAINS
  local EMAIL=$CERTBOT_EMAIL
  local VM_ID=$VM_IDENTITY_FILE
  local VM_SA_DIR=/home/$VM_USER/.service-accounts

  source ./tools/scripts/certbot-google-dns.sh

  scp -i $VM_ID -p $GCLOUD_SA_CERTBOT_PK $VM_USER@$VM_IP:$VM_SA_DIR
}

certbot
