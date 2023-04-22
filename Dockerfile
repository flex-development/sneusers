# DOCKERFILE
# https://docs.docker.com/engine/reference/builder
# https://github.com/BretFisher/node-docker-good-defaults
# https://github.com/nodejs/docker-node#nodealpine

# dependencies
# INSTALL DEPENDENCIES
FROM node:20.0.0-alpine As dependencies

ARG NODE_ENV production

ENV HUSKY 0
ENV NODE_ENV $NODE_ENV

WORKDIR /app
RUN apk --no-cache add curl
COPY .yarn ./.yarn
COPY .yarnrc.yml ./.yarnrc.yml
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
RUN --mount=type=secret,id=GITHUB_TOKEN,required GITHUB_TOKEN=$(cat /run/secrets/GITHUB_TOKEN) yarn
ENV PATH /app/node_modules/.bin:$PATH

# build
# BUILD SOURCE CODE
FROM dependencies As build

WORKDIR /app
COPY build.config.ts ./build.config.ts
COPY src ./src
COPY tsconfig.build.json ./tsconfig.build.json
COPY tsconfig.json ./tsconfig.json
RUN mkbuild

# production
# RUN PRODUCTION SERVERS
FROM node:20.0.0-alpine As production

WORKDIR /app
RUN apk --no-cache add curl
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json
EXPOSE 80 443
CMD ["node", "--enable-source-maps", "./dist/main.mjs"]
