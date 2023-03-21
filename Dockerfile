# DOCKERFILE
# https://docs.docker.com/engine/reference/builder
# https://github.com/BretFisher/node-docker-good-defaults
# https://github.com/nodejs/docker-node#nodealpine

# dependencies
# INSTALL DEPENDENCIES
FROM node:19-alpine As dependencies

ARG CLOUDSDK_CORE_PROJECT
ARG GITHUB_TOKEN
ARG NODE_ENV=production

ENV CLOUDSDK_CORE_PROJECT $CLOUDSDK_CORE_PROJECT
ENV GITHUB_TOKEN $GITHUB_TOKEN
ENV HUSKY 0
ENV NODE_ENV $NODE_ENV

WORKDIR /app/$CLOUDSDK_CORE_PROJECT
RUN apk --no-cache add curl
COPY .yarn ./.yarn
COPY .yarnrc.yml ./.yarnrc.yml
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
RUN yarn

# development
# REBUILD SOURCE CODE
# TODO: try enabling watch mode
FROM dependencies As development

WORKDIR /app/$CLOUDSDK_CORE_PROJECT
COPY build.config.ts ./build.config.ts
COPY src ./src
COPY tsconfig.build.json ./tsconfig.build.json
COPY tsconfig.json ./tsconfig.json
COPY --from=dependencies /app/$CLOUDSDK_CORE_PROJECT/node_modules ./node_modules
ENV PATH /app/$CLOUDSDK_CORE_PROJECT/node_modules/.bin:$PATH
RUN mkbuild

# build
# BUILD SOURCE CODE FOR PRODUCTION SERVER
FROM development As build

WORKDIR /app/$CLOUDSDK_CORE_PROJECT
COPY build.config.ts ./build.config.ts
COPY src ./src
COPY tsconfig.build.json ./tsconfig.build.json
COPY tsconfig.json ./tsconfig.json
COPY --from=dependencies /app/$CLOUDSDK_CORE_PROJECT/node_modules ./node_modules
ENV PATH /app/$CLOUDSDK_CORE_PROJECT/node_modules/.bin:$PATH
RUN mkbuild

# ecosystem
# PRODUCTION SERVER
FROM node:19-alpine As ecosystem

ARG CLOUDSDK_CORE_PROJECT
ARG PORT=8080

ENV CLOUDSDK_CORE_PROJECT $CLOUDSDK_CORE_PROJECT
ENV PORT $PORT

WORKDIR /app/$CLOUDSDK_CORE_PROJECT
COPY --from=build /app/$CLOUDSDK_CORE_PROJECT/dist ./dist
COPY --from=build /app/$CLOUDSDK_CORE_PROJECT/src ./src
COPY --from=dependencies /app/$CLOUDSDK_CORE_PROJECT/node_modules ./node_modules
COPY --from=dependencies /app/$CLOUDSDK_CORE_PROJECT/package.json ./package.json
EXPOSE $PORT
CMD ["node", "--enable-source-maps", "./dist/main.mjs"]
