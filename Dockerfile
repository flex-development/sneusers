# DOCKERFILE REFERENCE: https://docs.docker.com/engine/reference/builder

# deps - INSTALL DEPENDENCIES ONLY WHEN NEEDED
#
# 1. Use node 14 (alpine) base image
#    - see: https://github.com/nodejs/docker-node#nodealpine
# 2. Allow build arguments
# 3. Set environment variables
# 4. Set working directory
# 5. Copy Yarn directory
# 6. Copy Yarn configuration, project manifest, and dependency graph
# 7. Install and cache project dependencies
FROM node:14-alpine As deps

ARG GH_PAT
ARG NODE_ENV
ARG NPM_TOKEN

ENV GH_PAT $GH_PAT
ENV NODE_ENV $NODE_ENV
ENV NPM_TOKEN $NPM_TOKEN

WORKDIR /usr/app
COPY .yarn/ ./.yarn/
COPY .yarnrc.yml package.json yarn.lock ./
RUN yarn workspaces focus @flex-development/sneusers

# builder - REBUILD SOURCE CODE ONLY WHEN NEEDED
#
# 1. Use node 14 (alpine) base image
#    - see: https://github.com/nodejs/docker-node#nodealpine
# 2. Allow build arguments
# 3. Set environment variables
# 4. Set working directory
# 5. Copy all files to working directory
# 6. Copy node_modules from 'deps'
# 7. Install and cache project dependencies + build project
FROM node:14-alpine As builder

ARG GH_PAT
ARG NODE_ENV
ARG NPM_TOKEN

ENV GH_PAT $GH_PAT
ENV NODE_ENV $NODE_ENV
ENV NPM_TOKEN $NPM_TOKEN

WORKDIR /usr/app
COPY . .
COPY --from=deps /usr/app/node_modules ./node_modules
RUN yarn workspaces focus @flex-development/sneusers && yarn build

# runner - APPLICATION RUNNER
#
# 1. Use node 14 (alpine) base image
#    - see: https://github.com/nodejs/docker-node#nodealpine
# 2. Allow build arguments
# 3. Set environment variables
# 4. Set working directory
# 5. Install Doppler
# 6. Copy project build from 'builder'
# 7. Copy NestJS configuration from 'builder'
# 8. Copy project manifest from 'builder'
# 9. Run application
# 10. Expose port application is running on
FROM node:14-alpine As runner

ARG DOPPLER_CONFIG
ARG DOPPLER_PROJECT
ARG DOPPLER_TOKEN
ARG PORT

ENV DOPPLER_CONFIG $DOPPLER_CONFIG
ENV DOPPLER_PROJECT $DOPPLER_PROJECT
ENV DOPPLER_TOKEN $DOPPLER_TOKEN
ENV PORT $PORT

WORKDIR /usr/app
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && apk add doppler
COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/nest-cli.json ./nest-cli.json
COPY --from=builder /usr/app/package.json ./package.json
CMD ["doppler", "run", "--", "yarn", "run:app", "-wd"]
EXPOSE $PORT
