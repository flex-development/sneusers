#!/bin/zsh

# Certbot x Google Cloud DNS - Local
#
# Usage:
#
# $ chmod +x ./tools/scripts/certbot-local.sh
# $ CERTBOT_DOMAINS=<certbot-domains-list>
# $ CERTBOT_EMAIL=<certbot-email>
# $ ./tools/scripts/certbot-local.sh

certbot_local() {
  local CERTBOT_DIR_VM_USER=/home/$VM_USER/letsencrypt
  local DOMAINS=$CERTBOT_DOMAINS
  local EMAIL=$CERTBOT_EMAIL

  source ./tools/scripts/certbot-google-dns.sh

  sudo rm -rf ./letsencrypt && sudo mkdir ./letsencrypt
  sudo mkdir ./letsencrypt/archive && sudo mkdir ./letsencrypt/live

  sudo cp -rf /etc/letsencrypt/archive/$TLD ./letsencrypt/archive/$TLD
  sudo cp -rf /etc/letsencrypt/live/$TLD ./letsencrypt/live/$TLD
  sudo cp -rf /etc/letsencrypt/ssl-dhparams.pem ./letsencrypt/ssl-dhparams.pem
}

certbot_local
