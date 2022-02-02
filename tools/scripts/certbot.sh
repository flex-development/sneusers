#!/bin/zsh

# Certbot x Google Cloud DNS
#
# Usage:
#
# $ chmod +x ./tools/scripts/certbot.sh
# $ CERTBOT_DOMAINS=<certbot-domains-list>
# $ CERTBOT_EMAIL=<certbot-email>
# $ SSH_HOST=<vm-ip-address>
# $ SSH_PRIVATE_KEY=<path-to-scp-identify-file>
# $ SSH_USER=<vm-ip-address>
# $ ./tools/scripts/certbot.sh

certbot() {
  local HOST=$SSH_HOST
  local ID=$SSH_PRIVATE_KEY
  local USER=$SSH_USER

  source ./tools/scripts/certbot-google-dns.sh

  scp -i $ID -p $GCLOUD_SA_CERTBOT_PK $USER@$HOST:/home/$USER/.service-accounts
}

certbot
