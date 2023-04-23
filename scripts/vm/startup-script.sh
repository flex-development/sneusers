#! /bin/sh

# Virtual Machine - Startup Script
#
# Prerequisites:
#
# export CLOUDSDK_CORE_PROJECT=<project-name>
# export CLOUDSDK_PYTHON=python2
# export IAM_POLICY_MEMBER=serviceAccount:$CLOUDSDK_CORE_ACCOUNT
# gcloud projects add-iam-policy-binding --member=$IAM_POLICY_MEMBER --role=roles/storage.admin
# gcloud storage buckets create gs://$(gcloud config get project)
# gcloud storage cp .env.vm gs://$(gcloud config get project)/etc/profile.d/env.sh
# gcloud storage cp docker-cloud.yml gs://$(gcloud config get project)/app/docker-compose.yml
#
# References:
#
# - https://cloud.google.com/sdk/gcloud/reference/projects/add-iam-policy-binding
# - https://cloud.google.com/sdk/gcloud/reference/storage/buckets/create
# - https://cloud.google.com/sdk/gcloud/reference/storage/cp
# - https://cloud.google.com/storage/docs/access-control/iam-permissions
# - https://docs.docker.com/engine/reference/commandline/compose_up
# - https://mkyong.com/linux/how-to-set-environment-variable-in-ubuntu
# - https://webdock.io/en/docs/how-guides/docker-guides/how-to-install-and-run-docker-containers-using-docker-compose

WORKDIR=app

CLOUDSDK_CORE_PROJECT=$(gcloud config get project)
DOCKER_COMPOSE_FILE=$WORKDIR/docker-compose.yml
DOCKER_DOWNLOAD_URL=https://download.docker.com/linux/ubuntu
ENVIRONMENT_FILE=/etc/profile.d/env.sh

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install ca-certificates -y
sudo apt-get install curl -y
sudo apt-get install gnupg -y
sudo apt-get install lsb-release -y
mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL $DOCKER_DOWNLOAD_URL/gpg | sudo gpg --dearmor --output /etc/apt/keyrings/docker.gpg --yes
echo deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] $DOCKER_DOWNLOAD_URL $(lsb_release -cs) stable | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
sudo apt-get update
sudo apt-get install containerd.io -y
sudo apt-get install docker-buildx-plugin -y
sudo apt-get install docker-ce -y
sudo apt-get install docker-ce-cli -y
sudo apt-get install docker-compose-plugin -y
sudo chmod 666 /var/run/docker.sock
sudo usermod -aG docker $USER
grep docker /etc/group
sudo gcloud storage cp gs://$CLOUDSDK_CORE_PROJECT$ENVIRONMENT_FILE $ENVIRONMENT_FILE
cp $ENVIRONMENT_FILE $WORKDIR/.env
gcloud storage cp gs://$CLOUDSDK_CORE_PROJECT/$DOCKER_COMPOSE_FILE $DOCKER_COMPOSE_FILE
docker compose --project-directory $WORKDIR up
