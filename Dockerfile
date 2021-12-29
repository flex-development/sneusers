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
# 8. Install and cache project dependencies + build project
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
RUN yarn workspaces focus @flex-development/sneusers && yarn build:app

# runner - APPLICATION RUNNER
#
# 1. Use node 14 (alpine) base image
#    - see: https://github.com/nodejs/docker-node#nodealpine
# 2. Allow build arguments
# 3. Set environment variables
# 4. Set working directory
# 5. Copy node_modules from 'deps'
# 6. Set $NODE_OPTIONS
# 7. Copy project build from 'builder'
# 8. Expose port application is running on and 9229 (for debugging)
# 9. Run application
FROM node:14-alpine As runner

ARG NODE_ENV=production
ARG PORT=8080

ENV DB_AUTO_LOAD_MODELS=false
ENV NODE_ENV $NODE_ENV
ENV PORT $PORT

WORKDIR /opt/sneusers
COPY --from=deps /opt/sneusers/node_modules ./node_modules
ENV NODE_OPTIONS -r ts-node/register
COPY --from=builder /opt/sneusers/dist ./dist
EXPOSE $PORT 9229
CMD ["node", "dist/main.js"]
