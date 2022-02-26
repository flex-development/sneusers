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

WORKDIR /opt/sneusers
COPY .yarn ./.yarn
COPY .yarnrc.yml ./.yarnrc.yml
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
RUN yarn workspaces focus @flex-development/sneusers
ENV NODE_OPTIONS -r ts-node/register
ENV PATH /opt/sneusers/node_modules/.bin:$PATH

# builder
# REBUILD SOURCE CODE ONLY WHEN NEEDED
FROM deps As builder

WORKDIR /opt/sneusers
COPY src ./src
COPY tools/helpers ./tools/helpers
COPY typings ./typings
COPY views ./views
COPY .sequelizerc ./.sequelizerc
COPY nest-cli.json ./nest-cli.json
COPY tsconfig.app.json ./tsconfig.app.json
COPY tsconfig.json ./tsconfig.json
COPY webpack.config.ts ./webpack.config.ts
COPY --from=deps /opt/sneusers/.yarn ./.yarn
COPY --from=deps /opt/sneusers/node_modules ./node_modules
COPY --from=deps /opt/sneusers/.yarnrc.yml ./.yarnrc.yml
COPY --from=deps /opt/sneusers/package.json ./package.json
COPY --from=deps /opt/sneusers/yarn.lock ./yarn.lock
RUN nest build

# runner
# APPLICATION RUNNER
FROM builder As runner

ARG PORT=8080

ENV PORT $PORT

WORKDIR /opt/sneusers
COPY --from=builder /opt/sneusers/dist ./dist
COPY --from=builder /opt/sneusers/src ./src
COPY --from=builder /opt/sneusers/tools/helpers ./tools/helpers
COPY --from=builder /opt/sneusers/typings ./typings
COPY --from=builder /opt/sneusers/views ./views
COPY --from=builder /opt/sneusers/.sequelizerc ./.sequelizerc
COPY --from=builder /opt/sneusers/nest-cli.json ./nest-cli.json
COPY --from=builder /opt/sneusers/tsconfig.app.json ./tsconfig.app.json
COPY --from=builder /opt/sneusers/tsconfig.json ./tsconfig.json
COPY --from=builder /opt/sneusers/webpack.config.ts ./webpack.config.ts
COPY --from=deps /opt/sneusers/node_modules ./node_modules
COPY --from=deps /opt/sneusers/package.json ./package.json
EXPOSE $PORT 9229
CMD ["nest", "start", "-wd"]

# ecosystem
# APPLICATION RUNNER (PRODUCTION)
FROM node:14-alpine As ecosystem

ARG PORT=8080

ENV PORT $PORT

RUN yarn global add pm2
WORKDIR /opt/sneusers
COPY ecosystem.config.cjs ./ecosystem.config.cjs
COPY --from=builder /opt/sneusers/dist ./dist
COPY --from=builder /opt/sneusers/src ./src
COPY --from=builder /opt/sneusers/tools/helpers ./tools/helpers
COPY --from=builder /opt/sneusers/views ./views
COPY --from=builder /opt/sneusers/.sequelizerc ./.sequelizerc
COPY --from=builder /opt/sneusers/tsconfig.json ./tsconfig.json
COPY --from=deps /opt/sneusers/node_modules ./node_modules
COPY --from=deps /opt/sneusers/package.json ./package.json
ENV NODE_OPTIONS -r ts-node/register
ENV PATH /opt/sneusers/node_modules/.bin:$PATH
EXPOSE $PORT 9229
CMD ["pm2-docker", "start", "ecosystem.config.cjs"]
