#!/bin/zsh

# Certbot x Google Cloud DNS x VM
#
# Usage:
#
# $ chmod +x ./tools/scripts/certbot.sh
# $ CERTBOT_DOMAINS=<certbot-domains-list>
# $ CERTBOT_EMAIL=<certbot-email>
# $ TLD=<top-level-domain>
# $ VM_IDENTITY_FILE=<path-to-scp-identify-file>
# $ VM_IP=<vm-ip-address>
# $ VM_USER=<vm-ip-address>
# $ ./tools/scripts/certbot.sh

certbot() {
  local CERTBOT_DIR=/etc/letsencrypt
  local DOMAINS=$CERTBOT_DOMAINS
  local EMAIL=$CERTBOT_EMAIL
  local SA_DIR=/Users/$USER/.service-accounts/google
  local VM_ID=$VM_IDENTITY_FILE
  local VM_SA_DIR=/home/$VM_USER/.service-accounts

  source ./tools/scripts/certbot-google-dns.sh

  sudo rm -rf ./letsencrypt && sudo cp -rf $CERTBOT_DIR ./

  sudo sed -i "" -e "s#$SA_DIR#$VM_SA_DIR#g" ./letsencrypt/renewal/$TLD.conf

  sudo scp -i $VM_ID -p $GCLOUD_SA_CERTBOT_PK $VM_USER@$VM_IP:$VM_SA_DIR
  sudo scp -i $VM_ID -r ./letsencrypt $VM_USER@$VM_IP:/home/$VM_USER

  ssh -i $VM_ID -t $VM_USER@$VM_IP sudo rm -rf $CERTBOT_DIR
  ssh -i $VM_ID -t $VM_USER@$VM_IP sudo mv /home/$VM_USER/letsencrypt /etc

  sudo rm -rf ./letsencrypt/accounts
  sudo rm -rf ./letsencrypt/csr
  sudo rm -rf ./letsencrypt/keys
  sudo rm -rf ./letsencrypt/renewal
  sudo rm -rf ./letsencrypt/renewal-hooks
}

certbot
