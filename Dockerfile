# DOCKERFILE
# https://docs.docker.com/engine/reference/builder
# https://docs.docker.com/reference/dockerfile
# https://github.com/BretFisher/node-docker-good-defaults
# https://github.com/nodejs/docker-node#nodealpine

# dependencies
# INSTALL DEPENDENCIES
FROM oven/bun:1.2.12 AS dependencies

ENV HUSKY=0

WORKDIR /app
COPY package.json ./package.json
RUN bun install --production

# code
# COPY SERVER CODE
FROM dependencies AS code

WORKDIR /app
COPY src ./src
COPY tsconfig.json ./tsconfig.json

# runner
# RUN SERVER
FROM oven/bun:1.2.12 AS runner

ENV HOST=0.0.0.0
ENV HOSTNAME=localhost
ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /app
COPY --from=code /app/src ./src
COPY --from=code /app/tsconfig.json ./tsconfig.json
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json
EXPOSE $PORT 9229
CMD ["bun", "run", "./src/main.mts"]
