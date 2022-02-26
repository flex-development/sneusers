#!/bin/bash

set -e
set -u

function create_database() {
  local database=$1

  echo "Creating database '$database'"

  psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" <<- EOSQL
    CREATE DATABASE $database;
	  GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
}

if [ -n "$POSTGRES_DATABASES" ]; then
  echo "Database creation requested: $POSTGRES_DATABASES"

  for db in $(echo $POSTGRES_DATABASES | tr ',' ' '); do
    create_database $db
  done

  echo "Created requested databases"
fi
