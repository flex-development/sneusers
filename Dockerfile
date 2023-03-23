# DOCKERFILE
# https://docs.docker.com/engine/reference/builder
# https://github.com/BretFisher/node-docker-good-defaults
# https://github.com/nodejs/docker-node#nodealpine

# dependencies
# INSTALL DEPENDENCIES
FROM node:19-alpine As dependencies

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

# development
# REBUILD SOURCE CODE
# TODO: try enabling watch mode
FROM dependencies As development

WORKDIR /app
COPY build.config.ts ./build.config.ts
COPY src ./src
COPY tsconfig.build.json ./tsconfig.build.json
COPY tsconfig.json ./tsconfig.json
COPY --from=dependencies /app/node_modules ./node_modules
ENV PATH /app/node_modules/.bin:$PATH
RUN mkbuild

# build
# BUILD SOURCE CODE FOR PRODUCTION SERVER
FROM development As build

WORKDIR /app
COPY build.config.ts ./build.config.ts
COPY src ./src
COPY tsconfig.build.json ./tsconfig.build.json
COPY tsconfig.json ./tsconfig.json
COPY --from=dependencies /app/node_modules ./node_modules
ENV PATH /app/node_modules/.bin:$PATH
RUN mkbuild

# ecosystem
# PRODUCTION SERVER
FROM node:19-alpine As ecosystem

ARG PORT=8080

ENV PORT $PORT

WORKDIR /app
RUN apk --no-cache add curl
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json
EXPOSE $PORT
CMD ["node", "--enable-source-maps", "./dist/main.mjs"]
