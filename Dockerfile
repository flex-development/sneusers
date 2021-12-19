FROM node:14-alpine As builder

ARG NPM_TOKEN
ARG PAT_GPR

ENV NPM_TOKEN $NPM_TOKEN
ENV PAT_GPR $PAT_GPR

WORKDIR /usr/app

COPY .npmrc package.json ./

RUN yarn --ignore-engines

COPY . .

RUN yarn build

FROM node:14-alpine As runner

ARG NPM_TOKEN
ARG PAT_GPR
ARG PORT

ENV DOPPLER_CONFIG $DOPPLER_CONFIG
ENV DOPPLER_TOKEN $DOPPLER_TOKEN
ENV NPM_TOKEN $NPM_TOKEN
ENV PAT_GPR $PAT_GPR
ENV PORT $PORT

WORKDIR /usr/app

RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && apk add doppler

COPY .npmrc package.json ./

RUN yarn --ignore-engines

COPY . .

COPY --from=builder /usr/app/dist ./dist

CMD ["doppler", "run", "--", "nest", "start", "-wd"]

EXPOSE $PORT
