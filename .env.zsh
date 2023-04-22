# ENVIRONMENT VARIABLES - ZSH
#
# References:
#
# - https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/dotenv
# - https://homebrew-file.readthedocs.io/en/latest/usage.html

[ -f $PWD/.env.local ] && source $PWD/.env.local

CLOUDSDK_CORE_PROJECT=sneusers
TLD=$CLOUDSDK_CORE_PROJECT.app

APP_ENV=development
CLOUDSDK_ACTIVE_CONFIG_NAME=$CLOUDSDK_CORE_PROJECT
CLOUDSDK_COMPUTE_REGION=us-east4
CLOUDSDK_COMPUTE_ZONE=$CLOUDSDK_COMPUTE_REGION-a
CLOUDSDK_CORE_ACCOUNT=$CLOUDSDK_CORE_PROJECT@$CLOUDSDK_CORE_PROJECT.iam.gserviceaccount.com
CLOUDSDK_PYTHON=python3
CONTAINER_IMAGE_TAG=edge
GCE_SERVICE_ACCOUNT=$(cat ./.service-accounts/$CLOUDSDK_CORE_ACCOUNT.json)
HOMEBREW_BREWFILE=./Brewfile
HTTPS_CERT=$(cat .lego/certificates/_.$TLD.crt)
HTTPS_KEY=$(cat .lego/certificates/_.$TLD.key)
NODE_ENV=development
NODE_NO_WARNINGS=1
URL=http://localhost
