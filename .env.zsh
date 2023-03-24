# ENVIRONMENT VARIABLES - ZSH
#
# References:
#
# - https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/dotenv

[ -f $PWD/.env ] && source $PWD/.env
APP_ENV=development
CLOUDSDK_ACTIVE_CONFIG_NAME=$CLOUDSDK_CORE_PROJECT
CLOUDSDK_COMPUTE_ZONE=us-east4-a
CLOUDSDK_CORE_ACCOUNT=$CLOUDSDK_CORE_PROJECT@$CLOUDSDK_CORE_PROJECT.iam.gserviceaccount.com
CLOUDSDK_CORE_PROJECT=sneusers
CLOUDSDK_PYTHON=python3
CONTAINER_IMAGE=flex-development/sneusers
CONTAINER_IMAGE_TAG=edge
GCE_SERVICE_ACCOUNT_FILE=./.service-accounts/$CLOUDSDK_CORE_ACCOUNT.json
LEGO_CA_SERVER=https://acme-staging-v02.api.letsencrypt.org/directory
NODE_ENV=development
NODE_NO_WARNINGS=1
PORT=8090
SERVER_NAME=api.dev.$TLD
TLD=$CLOUDSDK_CORE_PROJECT.app
WHOAMI_PORT_NUMBER=8082
