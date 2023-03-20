# DOCKERFILE
# https://docs.docker.com/engine/reference/builder
# https://github.com/BretFisher/node-docker-good-defaults
# https://github.com/nodejs/docker-node#nodealpine

# deps
# INSTALL DEPENDENCIES ONLY WHEN NEEDED
FROM node:19-alpine As deps

ARG CLOUDSDK_CORE_PROJECT
ARG GITHUB_TOKEN
ARG NODE_ENV=production

ENV CLOUDSDK_CORE_PROJECT $CLOUDSDK_CORE_PROJECT
ENV GITHUB_TOKEN $GITHUB_TOKEN
ENV NODE_ENV $NODE_ENV

WORKDIR /app/$CLOUDSDK_CORE_PROJECT
COPY .yarn ./.yarn
COPY .yarnrc.yml ./.yarnrc.yml
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
RUN yarn

# builder
# REBUILD SOURCE CODE ONLY WHEN NEEDED
FROM deps As builder

WORKDIR /app/$CLOUDSDK_CORE_PROJECT
COPY build.config.ts ./build.config.ts
COPY src ./src
COPY tsconfig.build.json ./tsconfig.build.json
COPY tsconfig.json ./tsconfig.json
COPY --from=deps /app/$CLOUDSDK_CORE_PROJECT/.yarn ./.yarn
COPY --from=deps /app/$CLOUDSDK_CORE_PROJECT/.yarnrc.yml ./.yarnrc.yml
COPY --from=deps /app/$CLOUDSDK_CORE_PROJECT/node_modules ./node_modules
COPY --from=deps /app/$CLOUDSDK_CORE_PROJECT/package.json ./package.json
COPY --from=deps /app/$CLOUDSDK_CORE_PROJECT/yarn.lock ./yarn.lock
ENV PATH /app/$CLOUDSDK_CORE_PROJECT/node_modules/.bin:$PATH
RUN mkbuild

# runner
# DEVELOPMENT SERVER
FROM builder As runner

ARG PORT=8080

ENV PORT $PORT

WORKDIR /app/$CLOUDSDK_CORE_PROJECT
COPY --from=builder /app/$CLOUDSDK_CORE_PROJECT/dist ./dist
COPY --from=deps /app/$CLOUDSDK_CORE_PROJECT/node_modules ./node_modules
COPY --from=deps /app/$CLOUDSDK_CORE_PROJECT/package.json ./package.json
EXPOSE $PORT
CMD ["node", "--enable-source-maps", "./dist/main.mjs"]

# ecosystem
# PRODUCTION SERVER
FROM node:19-alpine As ecosystem

ARG PORT=8080

ENV PORT $PORT

WORKDIR /app/$CLOUDSDK_CORE_PROJECT
COPY ecosystem.config.cjs ./ecosystem.config.cjs
COPY --from=builder /app/$CLOUDSDK_CORE_PROJECT/dist ./dist
COPY --from=builder /app/$CLOUDSDK_CORE_PROJECT/src ./src
COPY --from=deps /app/$CLOUDSDK_CORE_PROJECT/node_modules ./node_modules
COPY --from=deps /app/$CLOUDSDK_CORE_PROJECT/package.json ./package.json
ENV PATH /app/$CLOUDSDK_CORE_PROJECT/node_modules/.bin:$PATH
EXPOSE $PORT
CMD ["pm2-docker", "start", "ecosystem.config.cjs", "-i", "max"]
