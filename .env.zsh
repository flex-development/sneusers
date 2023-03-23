# ENVIRONMENT VARIABLES - ZSH
#
# References:
#
# - https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/dotenv

[ -f $PWD/.env ] && source $PWD/.env
CLOUDSDK_CORE_PROJECT=sneusers
GCE_SERVICE_ACCOUNT_FILE=./.service-accounts/$GCE_IAM_ACCOUNT.json
LEGO_CA_SERVER=https://acme-staging-v02.api.letsencrypt.org/directory
NODE_ENV=development
NODE_NO_WARNINGS=1
