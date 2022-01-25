# DOCKERFILE REFERENCE: https://docs.docker.com/engine/reference/builder
# SEE: https://github.com/BretFisher/node-docker-good-defaults
# SEE: https://github.com/nodejs/docker-node#nodealpine

# deps
# INSTALL DEPENDENCIES ONLY WHEN NEEDED
FROM node:14-alpine As deps

ARG GH_PAT
ARG NODE_ENV=production
ARG NPM_TOKEN

ENV GH_PAT $GH_PAT
ENV NODE_ENV $NODE_ENV
ENV NPM_TOKEN $NPM_TOKEN

RUN mkdir /opt/sneusers && chown node:node /opt/sneusers
WORKDIR /opt/sneusers
USER node
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node .yarnrc.yml ./.yarnrc.yml
COPY --chown=node:node package.json ./package.json
COPY --chown=node:node yarn.lock ./yarn.lock
RUN yarn workspaces focus @flex-development/sneusers
ENV PATH /opt/sneusers/node_modules/.bin:$PATH

# builder
# REBUILD SOURCE CODE ONLY WHEN NEEDED
FROM node:14-alpine As builder

ARG GH_PAT
ARG NODE_ENV=production
ARG NPM_TOKEN
ARG WEBPACK_LOG_SECRETS=false

ENV GH_PAT $GH_PAT
ENV NODE_ENV $NODE_ENV
ENV NPM_TOKEN $NPM_TOKEN
ENV WEBPACK_LOG_SECRETS $WEBPACK_LOG_SECRETS

RUN apk --no-cache add curl
WORKDIR /opt/sneusers
COPY db/config ./db/config
COPY db/migrations ./db/migrations
COPY db/seeders ./db/seeders
COPY src ./src
COPY tools/helpers ./tools/helpers
COPY typings ./typings
COPY views ./views
COPY .env ./.env
COPY nest-cli.json ./nest-cli.json
COPY tsconfig.app.json ./tsconfig.app.json
COPY tsconfig.json ./tsconfig.json
COPY webpack.config.ts ./webpack.config.ts
COPY --from=deps /opt/sneusers/.yarn ./.yarn
COPY --from=deps /opt/sneusers/node_modules ./node_modules
COPY --from=deps /opt/sneusers/.yarnrc.yml ./.yarnrc.yml
COPY --from=deps /opt/sneusers/package.json ./package.json
COPY --from=deps /opt/sneusers/yarn.lock ./yarn.lock
RUN yarn workspaces focus @flex-development/sneusers
ENV PATH /opt/sneusers/node_modules/.bin:$PATH
RUN yarn build:app

# runner
# APPLICATION RUNNER
FROM node:14-alpine As runner

ARG NODE_ENV=production
ARG PORT=8080

ENV DB_AUTO_LOAD_MODELS=false
ENV NODE_ENV $NODE_ENV
ENV PORT $PORT

RUN apk --no-cache add curl
WORKDIR /opt/sneusers
COPY --from=builder /opt/sneusers/db/config ./db/config
COPY --from=builder /opt/sneusers/db/migrations ./db/migrations
COPY --from=builder /opt/sneusers/db/seeders ./db/seeders
COPY --from=builder /opt/sneusers/dist ./dist
COPY --from=builder /opt/sneusers/src ./src
COPY --from=builder /opt/sneusers/tools/helpers ./tools/helpers
COPY --from=builder /opt/sneusers/typings ./typings
COPY --from=builder /opt/sneusers/views ./views
COPY --from=builder /opt/sneusers/.env ./.env
COPY --from=builder /opt/sneusers/nest-cli.json ./nest-cli.json
COPY --from=builder /opt/sneusers/tsconfig.app.json ./tsconfig.app.json
COPY --from=builder /opt/sneusers/tsconfig.json ./tsconfig.json
COPY --from=builder /opt/sneusers/webpack.config.ts ./webpack.config.ts
COPY --from=deps /opt/sneusers/node_modules ./node_modules
COPY --from=deps /opt/sneusers/package.json ./package.json
ENV NODE_OPTIONS -r ts-node/register
ENV PATH /opt/sneusers/node_modules/.bin:$PATH
EXPOSE $PORT 9229
CMD ["yarn", "run:app", "-wd"]

# ecosystem
# APPLICATION RUNNER (PRODUCTION)
FROM node:14-alpine As ecosystem

ARG DOPPLER_CONFIG=prod
ARG DOPPLER_TOKEN
ARG NODE_ENV=production
ARG PORT=8080

ENV DOPPLER_CONFIG $DOPPLER_CONFIG
ENV DOPPLER_TOKEN $DOPPLER_TOKEN
ENV NODE_ENV $NODE_ENV
ENV PORT $PORT

RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && apk add doppler
RUN yarn global add pm2
WORKDIR /opt/sneusers
COPY ecosystem.config.cjs ./ecosystem.config.cjs
COPY --from=builder /opt/sneusers/db/config ./db/config
COPY --from=builder /opt/sneusers/db/migrations ./db/migrations
COPY --from=builder /opt/sneusers/db/seeders ./db/seeders
COPY --from=builder /opt/sneusers/dist ./dist
COPY --from=builder /opt/sneusers/src ./src
COPY --from=builder /opt/sneusers/tools/helpers ./tools/helpers
COPY --from=builder /opt/sneusers/views ./views
COPY --from=builder /opt/sneusers/tsconfig.json ./tsconfig.json
COPY --from=deps /opt/sneusers/node_modules ./node_modules
COPY --from=deps /opt/sneusers/package.json ./package.json
ENV NODE_OPTIONS -r ts-node/register
ENV PATH /opt/sneusers/node_modules/.bin:$PATH
EXPOSE $PORT 9229
CMD ["doppler", "run", "--", "pm2-docker", "start", "ecosystem.config.cjs"]
