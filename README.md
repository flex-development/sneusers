# :tipping_hand_person: sneusers

[![Docker](https://badgen.net/badge/-/docker?icon=docker&label)](https://docker.com)
[![NestJS](https://badgen.net/badge/-/nestjs?color=e0234e&icon=https://iconape.com/wp-content/files/kr/371166/svg/371166.svg&iconColor=white&label)](https://nestjs.com)
[![TypeScript](https://badgen.net/badge/-/typescript?icon=typescript&label)](https://typescriptlang.org)
[![tested with mocha](https://img.shields.io/badge/tested%20with-mocha-brown?color=8d684b)](https://mochajs.org)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

**[Contributing Guide](CONTRIBUTING.md)**  
**[Database Design](docs/DATABASE.dbml)**  
**[Todo List](TODO.md)**

## Getting Started

Sneusers is a users system API built with [NestJS][5], a framework for building
server-side applications. The project is a re-implementation of [`neusers`][12],
an older Flex Development project. The main goal for this project was learning
how to use [Docker][2] and [Google Compute Engine][4].

Docker is used to manage project infrastructure: [Adminer][1], [Postgres][7],
[Redis][8], [Redis Commander][9], and the [NestJS][5] application itself. A
[`Dockerfile`](Dockerfile) was created to containerize the API. The serverless
architecture found in [`neusers`][12] was replaced with a [Compute Engine][4]
instance; an [Nginx][6] reverse proxy is in charge of handling web traffic.
Rather than using the Firebase Realtime Database, a traditional [PostgreSQL][7]
database was used for data persistence.

### Features

- Register new users
- Send verification emails
- Login and authenticate users
- Generate access and refresh tokens
- Persist and modify user data
- Paginated search results
- Cache search results

### Project Task

Create a basic users system illustrating the following concepts:

- Setting up a database
- Registering new users
- User authentication
- Retrieving user data
- Logging in users
- Password hashing

Reference: [Node JS Project Ideas - Basic Users System][13]

## Usage

### Prerequesites

#### 1. Install Docker

> Docker is an open platform for developing, shipping, and running applications.
> Docker enables you to separate your applications from your infrastructure so
> you can deliver software quickly. With Docker, you can manage your
> infrastructure in the same ways you manage your applications.
>
> \- [Docker overview](https://docs.docker.com/get-started/overview)

Docker containerizes each piece of the project infrastructure and allows
developers to run containers simultaneously, or in isolation.

Docker Compose is a tool for defining and running multi-container Docker
applications.

A YAML file, [`docker-compose.yml`](docker-compose.yml), is used to configure
application services. This project also makes use of a second configuration
file, [`docker-cloud.yml`](docker-cloud.yml), for use in staging and production
environmnets.

See [Get Docker][14] for help installing Docker on your platform.

### Environment Variables

#### Application ([`ghcr.io/flex-development/sneusers`][15])

| name                         | default                                         | description                                                                                |
| ---------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `API_SERVER_DESCRIP_DEV`     | -                                               | Development server description                                                             |
| `API_SERVER_DESCRIP_PROD`    | -                                               | Production server description                                                              |
| `API_SERVER_DESCRIP_STG`     | -                                               | Staging server description                                                                 |
| `API_SERVER_URL_DEV`         | -                                               | Development server url                                                                     |
| `API_SERVER_URL_PROD`        | -                                               | Production server url                                                                      |
| `API_SERVER_URL_STG`         | -                                               | Staging server url                                                                         |
| `APP_ENV`                    | `AppEnv.DEV`                                    | Application environment (`'development' \| 'production' \| 'staging' \| 'test'`)           |
| `CACHE_MAX`                  | `10`                                            | Maximum number of responses to store in the cache                                          |
| `CACHE_TTL`                  | `5`                                             | Amount of time a response is cached before it is deleted (s)                               |
| `COOKIE_SECRET`              | -                                               | Cookie signing secret                                                                      |
| `CSURF_COOKIE_HTTP_ONLY`     | `false`                                         | Force `csurf` cookies to be accessible by the web server only                              |
| `CSURF_COOKIE_KEY`           | `'_csrf'`                                       | Name of cookie to use to store `csurf` token secret                                        |
| `CSURF_COOKIE_MAX_AGE`       | `86400`                                         | Number to use when calculating `csurf` cookie expiration time (s)                          |
| `CSURF_COOKIE_PATH`          | `'/'`                                           | `csurf` cookie path                                                                        |
| `CSURF_COOKIE_SAME_SITE`     | `false`                                         | `csurf` cookie same site policy                                                            |
| `CSURF_COOKIE_SECURE`        | `false`                                         | Force `csurf` cookies to be used over `HTTPS` only                                         |
| `CSURF_COOKIE_SIGNED`        | `false`                                         | Sign `csurf` cookies                                                                       |
| `DB_AUTO_LOAD_MODELS`        | `true`                                          | Automatically load database models                                                         |
| `DB_HOST`                    | -                                               | Hostname of database to connect to                                                         |
| `DB_LOG_QUERY_PARAMS`        | `true`                                          | Show database bind parameters in log                                                       |
| `DB_MIGRATE`                 | `false`                                         | Run database migrations with `umzug`                                                       |
| `DB_NAME`                    | -                                               | Name of database to connect to                                                             |
| `DB_PASSWORD`                | -                                               | Database password                                                                          |
| `DB_PORT`                    | `5432`                                          | Port of database to connect to                                                             |
| `DB_RETRY_ATTEMPTS`          | `10`                                            | Number of attempts to connect to the database                                              |
| `DB_RETRY_DELAY`             | `3000`                                          | Delay between database connection retry attempts (ms)                                      |
| `DB_SYNC_ALTER`              | `true`                                          | `ALTER` tables to fit database models during synchronization. Does **not** delete any data |
| `DB_SYNC_FORCE`              | `false`                                         | `DROP` existing tables before creating new tables during synchronization                   |
| `DB_SYNCHRONIZE`             | `true`                                          | Automatically synchronize database models (requires `$DB_AUTO_LOAD_MODELS=true`)           |
| `DB_TIMEZONE`                | -                                               | Timezone to use when converting a date from the database into a JavaScript `Date` object   |
| `DB_USERNAME`                | -                                               | Database user                                                                              |
| `DEBUG`                      | -                                               | Enables/disables specific debugging namespaces                                             |
| `DEBUG_COLORS`               | -                                               | Whether or not to use colors in the debug output                                           |
| `EMAIL_CLIENT`               | -                                               | Google service account `client_id`                                                         |
| `EMAIL_HOST`                 | `'smtp.gmail.com'`                              | Hostname of email server                                                                   |
| `EMAIL_PORT`                 | `465`                                           | Port to send emails from                                                                   |
| `EMAIL_PRIVATE_KEY`          | -                                               | Google service account `private_key`                                                       |
| `EMAIL_SEND_AS`              | -                                               | Email address to send emails from                                                          |
| `EMAIL_USER`                 | -                                               | Email address used to authenticate with Google APIs                                        |
| `GH_AUTHORIZATION_URL`       | `'https://github.com/login/oauth/authorize'`    | GitHub OAuth authorization URL                                                             |
| `GH_CLIENT_ID`               | -                                               | GitHub OAuth client id                                                                     |
| `GH_CLIENT_SECRET`           | -                                               | GitHub OAuth client id                                                                     |
| `GH_SCOPES`                  | -                                               | List of GitHub OAuth scopes                                                                |
| `GH_SCOPES_SEPARATOR`        | `' '`                                           | `$GH_SCOPES` list separator                                                                |
| `GH_TOKEN_URL`               | `'https://github.com/login/oauth/access_token'` | GitHub OAuth access token URL                                                              |
| `GH_USER_EMAIL_URL`          | `'https://api.github.com/user/emails'`          | GitHub OAuth user email URL                                                                |
| `GH_USER_PROFILE_URL`        | `'https://api.github.com/user'`                 | GitHub OAuth user profile URL                                                              |
| `HOST`                       | `http://${HOSTNAME}:${PORT}`                    | Application URL (includes scheme and `PORT` if applicable)                                 |
| `HOSTNAME`                   | `'localhost'`                                   | Application hostname                                                                       |
| `JWT_EXP_ACCESS`             | `900`                                           | Access token expiration time (s)                                                           |
| `JWT_EXP_REFRESH`            | `86400`                                         | Refresh token expiration time (s)                                                          |
| `JWT_EXP_VERIFICATION`       | `86400`                                         | Verification token expiration time (s)                                                     |
| `JWT_SECRET_ACCESS`          | `'JWT_SECRET'`                                  | Access token signing secret                                                                |
| `JWT_SECRET_REFRESH`         | `'JWT_SECRET'`                                  | Refresh token signing secret                                                               |
| `JWT_SECRET_VERIFICATION`    | `'JWT_SECRET'`                                  | Verification token signing secret                                                          |
| `NEST_DEBUG`                 | `1`                                             | Enable NestJS dependency resolution logs                                                   |
| `NODE_ENV`                   | `NodeEnv.DEV`                                   | Node environment (`'development' \| 'production' \| 'test'`)                               |
| `PGAPPNAME`                  | -                                               | Postgres application name                                                                  |
| `PORT`                       | `8080`                                          | Port to run application on (and expose `app` service on)                                   |
| `REDIS_HOST`                 | `'redis'`                                       | Hostname of Redis server                                                                   |
| `REDIS_PASSWORD`             | -                                               | Redis server password                                                                      |
| `REDIS_PORT`                 | `6379`                                          | Port Redis server is running on                                                            |
| `REDIS_USERNAME`             | -                                               | Redis server username                                                                      |
| `SESSION_COOKIE_HTTP_ONLY`   | `false`                                         | Force `session` cookies to be accessible by the web server only                            |
| `SESSION_COOKIE_MAX_AGE`     | `86400`                                         | Number to use when calculating `session` cookie expiration time (s)                        |
| `SESSION_COOKIE_PATH`        | `'/'`                                           | `session` cookie path                                                                      |
| `SESSION_COOKIE_SAME_SITE`   | `SameSitePolicy.NONE`                           | `session` cookie same site policy                                                          |
| `SESSION_COOKIE_SECURE`      | `false`                                         | Force `session` cookies to be used over `HTTPS` only                                       |
| `SESSION_NAME`               | `'connect.sid'`                                 | Name of `session` ID cookie                                                                |
| `SESSION_PROXY`              | `undefined`                                     | Trust the reverse proxy when setting secure `session` cookies                              |
| `SESSION_RESAVE`             | `true`                                          | Force sessions to be saved back to the session store                                       |
| `SESSION_ROLLING`            | `false`                                         | Force the session identifier cookie to be set on every response                            |
| `SESSION_SAVE_UNINITIALIZED` | `true`                                          | Forces sessions that are new, but unmodified to be saved to the store                      |
| `SESSION_SECRET`             | -                                               | Secret used to sign session ID cookies                                                     |
| `SESSION_UNSET`              | `SessionUnset.KEEP`                             | Control the result of unsetting `req.session`                                              |
| `THROTTLE_LIMIT`             | `10`                                            | Maximum number of requests within the `THROTTLE_TTL` limit                                 |
| `THROTTLE_TTL`               | `60`                                            | Number of seconds that each request will last in storage                                   |
| `TLD`                        | -                                               | Top level domain                                                                           |

See the [`EnvironmentVariables`](src/models/environment-variables.model.ts)
model for more detailed descriptions.

#### Docker Compose

| name                        | description                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| `ADMINER_PORT`              | Port to expose `adminer` service on                                                                 |
| `ADMINER_SERVER_NAME`       | Nginx `server_name` for `adminer` service                                                           |
| `DB_HOST`                   | Hostname of database to connect to                                                                  |
| `DB_PORT`                   | Port of database to connect to                                                                      |
| `DOCKER_IMAGE_TAG`          | `ghcr.io/$DOCKER_IMAGE` image tag                                                                   |
| `DOCKER_IMAGE`              | Docker app image name                                                                               |
| `GH_PAT`                    | GitHub personal access token with at least `read:packages` scope                                    |
| `NODE_ENV`                  | Node environment (`'development' \| 'production' \| 'test'`)                                        |
| `NPM_TOKEN`                 | NPM registry auth token                                                                             |
| `PGAPPNAME`                 | <https://www.postgresql.org/docs/14/libpq-connect.html#LIBPQ-CONNECT-APPLICATION-NAME>              |
| `PGDATA`                    | [`postgres` database files location](https://www.postgresql.org/docs/14/storage-file-layout.html)   |
| `PGPORT`                    | <https://www.postgresql.org/docs/14/libpq-connect.html#LIBPQ-CONNECT-PORT>                          |
| `PGTZ`                      | Postgres default timezone                                                                           |
| `PGUSER`                    | <https://www.postgresql.org/docs/14/libpq-connect.html#LIBPQ-CONNECT-USER>                          |
| `PG_COLOR`                  | Use color in `postgres` diagnostic messages (`'always' \| 'auto' \| 'never'`)                       |
| `PORT`                      | Port to run application on (and expose `app` service on)                                            |
| `POSTGRES_DATABASES`        | Comma-delimited list of `postgres` databases                                                        |
| `POSTGRES_HOST_AUTH_METHOD` | Postgres `auth-method` for `host` connections for `all` databases, `all` users, and `all` addresses |
| `POSTGRES_IMAGE_TAG`        | `postgres` image tag                                                                                |
| `POSTGRES_INITDB_ARGS`      | Space-delimited list of `postgres initdb` arguments                                                 |
| `POSTGRES_INITDB_WALDIR`    | `postgres` transaction log location                                                                 |
| `POSTGRES_PASSWORD`         | `postgres` superuser password                                                                       |
| `POSTGRES_USER`             | `postgres` superuser username                                                                       |
| `REDIS_COMMANDER_PORT`      | Port to run and expose `redis-commander` service on                                                 |
| `REDIS_HOST`                | Hostname of Redis server                                                                            |
| `REDIS_PASSWORD`            | Redis server password                                                                               |
| `REDIS_PORT`                | Port Redis server is running on                                                                     |
| `REDIS_SERVER_NAME`         | Nginx `server_name` for `redis-commander` service                                                   |
| `REDIS_USER`                | Redis server username                                                                               |
| `SERVER_NAME`               | Nginx `server_name` for `app` service                                                               |
| `TLD`                       | Top level domain                                                                                    |

Note that [Docker Image](#application-ghcrioflex-developmentsneusers) variables
are required to run the `app` service.

### Nginx Reverse Proxy

The [`nginx`](docker-compose.yml) service works as a [reverse proxy][16].

Three servers are configured to proxy requests to Docker Compose services:

- [`adminer`](nginx/templates/adminer.conf.template): `adminer`
- [`api`](nginx/templates/api.conf.template): `app`
- [`redis`](nginx/templates/redis.conf.template): `redis-commander`

#### SSL Certificates

The `nginx` service is configured to work with an SSL certificate.

Certifcates can be generated with [Let's Encrypt][17].

If you're using [Google Cloud DNS][3], you can use the
[`certbot-google-dns`](tools/scripts/certbot-google-dns.sh) script to generate a
certificate:

```shell
CERTBOT_EMAIL=letsencrypt@<domain>
GCLOUD_DOMAINS=<certbot-domains-list>
GCLOUD_PROJECT=<project-id>
GCLOUD_SA_CERTBOT=certbot@$GCLOUD_PROJECT.iam.gserviceaccount.com
GCLOUD_SA_CERTBOT_PK=~/.service-accounts/google/$GCLOUD_SA_CERTBOT.json
$ chmod +x ./tools/scripts/certbot-google-dns.sh
$ ./tools/scripts/certbot-google-dns.sh
```

Certificate symlinks can be found in `/etc/letsencrypt/live/$TLD`.

To configure automated renewals, see [Setting up automated renewal][18].

##### Self Signed Certificates

To use [self-signed certificates][19] instead, edit the `ssl.conf`
[template](nginx/templates/ssl.conf.template).

#### Edit `/etc/hosts`

To access an unrecognized domain from your local machine, you may need to update
your local DNS system:

1. Open `/etc/hosts`

   With Visual Studio Code - Insiders: `code-insiders /etc/hosts`

2. Update your local DNS system:

   ```hosts
   # $GCLOUD_PROJECT
   # see: https://linuxhint.com/edit-etc-hosts-linux
   # see: https://gist.github.com/soheilhy/8b94347ff8336d971ad0
   
   # local machine
   127.0.0.1 api.dev.$TLD
   127.0.0.1 db.dev.$TLD
   127.0.0.1 redis.dev.$TLD
   
   # staging virtual machine
   $VM_IP_STG api.stg.$TLD
   $VM_IP_STG db.stg.$TLD
   $VM_IP_STG redis.stg.$TLD
   
   # production virtual machine
   $VM_IP api.$TLD
   $VM_IP db.$TLD
   $VM_IP redis.$TLD
   # End of section
   ```

   where:

   - `$GCLOUD_PROJECT` is your Google Cloud Platform project id
   - `$TLD` is your top-level domain
   - `$VM_IP_STG` is the IP address of your staging virtual machine instance
   - `$VM_IP` is the IP address of your production virtual machine instance

   afterwards:

   - `ping` each host to make sure they resolve

### Running Services

The scripts below assume you're using [Docker Compose v2][20].

- Development: `docker compose up --build`
- Staging: `docker compose -f docker-cloud.yml up`

See the [docker compose CLI][21] docs for an overview of command options.

Be aware that examples found in the docs will use the `docker-compose` command
rather than `docker compose`.

### Virtual Machines

Sneusers is deployed with [Google Compute Engine][4], but you can use any
platform you feel comfortable with.

See [Virtual Machine Setup][22] for help setting up a virtual machine running
`Ubuntu 20.04`.

## Built With

- [Adminer][1]
- [Docker][2]
- [Google Cloud DNS][3]
- [Google Compute Engine][4]
- [NestJS][5]
- [Nginx][6]
- [PostgreSQL][7]
- [Redis][8]
- [Redis Commander][9]
- [Sequelize][10]
- [TypeScript][11]

[1]: https://hub.docker.com/_/adminer
[2]: https://docker.com
[3]: https://cloud.google.com/dns
[4]: https://cloud.google.com/compute
[5]: https://nestjs.com
[6]: https://hub.docker.com/_/nginx
[7]: https://hub.docker.com/_/postgres
[8]: https://hub.docker.com/_/redis
[9]: https://github.com/joeferner/redis-commander
[10]: https://sequelize.org/v7
[11]: https://typescriptlang.org
[12]: https://github.com/flex-development/neusers
[13]:
  https://www.blog.duomly.com/node-js-project-ideas-for-beginners#2-basic-users-system
[14]: https://docs.docker.com/get-docker
[15]: https://github.com/flex-development/sneusers/pkgs/container/sneusers
[16]: https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy
[17]: https://letsencrypt.org
[18]:
  https://eff-certbot.readthedocs.io/en/stable/using.html#setting-up-automated-renewal
[19]:
  https://letsencrypt.org/docs/certificates-for-localhost#making-and-trusting-your-own-certificates
[20]: https://docs.docker.com/compose/cli-command
[21]: https://docs.docker.com/compose/reference
[22]: https://gist.github.com/unicornware/34d6f4678232ee4bd99cad861209577b
