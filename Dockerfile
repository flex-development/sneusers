# DOCKERFILE REFERENCE: https://docs.docker.com/engine/reference/builder
# SEE: https://github.com/BretFisher/node-docker-good-defaults

# deps - INSTALL DEPENDENCIES ONLY WHEN NEEDED
#
# 1. Use node 14 (alpine) base image
#    - see: https://github.com/nodejs/docker-node#nodealpine
# 2. Allow build arguments
# 3. Set environment variables
# 4. Change permissions of working directory
# 5. Set working directory
# 6. Set user
# 7. Copy Yarn directory
# 8. Copy Yarn configuration
# 9. Copy project manifest
# 10. Copy dependency graph
# 11. Install and cache project dependencies
# 12. Update $PATH
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

# builder - REBUILD SOURCE CODE ONLY WHEN NEEDED
#
# 1. Use node 14 (alpine) base image
#    - see: https://github.com/nodejs/docker-node#nodealpine
# 2. Allow build arguments
# 3. Set environment variables
# 4. Install `curl`
# 5. Set working directory
# 6. Copy all files to working directory
#    - see .dockerignore for ignored files, and docker-compose.yml for volumes
# 7. Copy node_modules from 'deps'
# 8. Install and cache project dependencies + rebuild binaries
# 9. Build project
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
COPY --chown=node:node . .
COPY --from=deps /opt/sneusers/node_modules ./node_modules
RUN yarn workspaces focus @flex-development/sneusers && yarn rebuild
RUN yarn build:app

# runner - APPLICATION RUNNER
#
# 1. Use node 14 (alpine) base image
#    - see: https://github.com/nodejs/docker-node#nodealpine
# 2. Allow build arguments
# 3. Set environment variables
# 4. Install `curl`
# 5. Set working directory
# 6. Copy node_modules from 'deps'
# 7. Copy NestJS configuration from 'builder'
# 8. Copy project manifest from 'builder'
# 9. Copy webpack configuration from 'builder'
# 10. Expose port application is running on and 9229 (debugging)
# 11. Run application
FROM node:14-alpine As runner

ARG NODE_ENV=production
ARG PORT=8080
ARG WEBPACK_LOG_SECRETS=false

ENV NODE_ENV $NODE_ENV
ENV PORT $PORT
ENV WEBPACK_LOG_SECRETS $WEBPACK_LOG_SECRETS

RUN apk --no-cache add curl
WORKDIR /opt/sneusers
COPY --from=deps /opt/sneusers/node_modules ./node_modules
COPY --from=builder /opt/sneusers/nest-cli.json ./nest-cli.json
COPY --from=builder /opt/sneusers/package.json ./package.json
COPY --from=builder /opt/sneusers/webpack.config.ts ./webpack.config.ts
EXPOSE $PORT 9229

# ecosystem - APPLICATION RUNNER (PRODUCTION)
#
# 1. Use node 14 (alpine) base image
#    - see: https://github.com/nodejs/docker-node#nodealpine
# 2. Allow build arguments
# 3. Set environment variables
# 4. Install pm2 globally
#    - see: https://github.com/Unitech/pm2
# 5. Set working directory
# 6. Copy node_modules from 'deps'
# 7. Copy project build from 'builder'
# 8. Expose port application is running on and 9229 (debugging)
# 9. Run application
FROM node:14-alpine As ecosystem

ARG PORT=8080

ENV PORT $PORT

RUN yarn global add pm2
WORKDIR /opt/sneusers
COPY --from=deps /opt/sneusers/node_modules ./node_modules
COPY --from=builder /opt/sneusers/dist ./dist
EXPOSE $PORT 9229
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]
