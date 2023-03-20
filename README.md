# :tipping_hand_person: sneusers

[![github release](https://img.shields.io/github/v/release/flex-development/sneusers.svg)](https://github.com/flex-development/sneusers/releases/latest)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![license](https://img.shields.io/github/license/flex-development/sneusers.svg)](LICENSE.md)
[![conventional commits](https://img.shields.io/badge/-conventional%20commits-fe5196?logo=conventional-commits&logoColor=ffffff)](https://conventionalcommits.org/)
[![docker](https://badgen.net/badge/-/docker?icon=docker&label)](https://docker.com)
[![nestjs](https://badgen.net/badge/-/nestjs?color=e0234e&icon=https://iconape.com/wp-content/files/kr/371166/svg/371166.svg&iconColor=white&label)](https://nestjs.com)
[![typescript](https://img.shields.io/badge/-typescript-3178c6?logo=typescript&logoColor=ffffff)](https://typescriptlang.org/)
[![vitest](https://img.shields.io/badge/-vitest-6e9f18?style=flat&logo=vitest&logoColor=ffffff)](https://vitest.dev/)
[![yarn](https://img.shields.io/badge/-yarn-2c8ebb?style=flat&logo=yarn&logoColor=ffffff)](https://yarnpkg.com/)

Demo users system API

## Contents

- [What is this?](#what-is-this)
- [Use](#use)
- [Built With](#built-with)
- [Types](#types)
- [Contribute](#contribute)

## What is this?

Sneusers is a demo users system API built with [NestJS][1], a framework for building server-side applications.

The project is a re-implementation of [`neusers`][2], an older Flex Development project. The main goal for this project
was learning how to use [Docker][3] and [Google Compute Engine][4].

Docker is used to manage project infrastructure: [Adminer][5], [Postgres][6], [Redis][7], [Redis Commander][8], and the
[NestJS][1] application itself. A [`Dockerfile`](Dockerfile) was created to containerize the API. The serverless
architecture found in [`neusers`][2] was replaced with a [Compute Engine][4] instance; an [Nginx][9] reverse proxy is
in charge of handling web traffic. A traditional [PostgreSQL][6] database was used for data persistence in lieu of the
Firebase Realtime Database.

## Use

**TODO**: usage documentation.

## Built With

- [Adminer][5]
- [Docker][3]
- [Google Cloud DNS][10]
- [Google Compute Engine][4]
- [NestJS][1]
- [Nginx][9]
- [PostgreSQL][6]
- [Redis][7]
- [Redis Commander][8]
- [Sequelize][11]
- [TypeScript][12]

## Types

This action is fully typed with [TypeScript][12].

## Contribute

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

[1]: https://nestjs.com
[2]: https://github.com/flex-development/neusers
[3]: https://docker.com
[4]: https://cloud.google.com/compute
[5]: https://hub.docker.com/_/adminer
[6]: https://hub.docker.com/_/postgres
[7]: https://hub.docker.com/_/redis
[8]: https://github.com/joeferner/redis-commander
[9]: https://hub.docker.com/_/ngin
[10]: https://cloud.google.com/dns
[11]: https://sequelize.org/docs/v7/
[12]: https://typescriptlang.org
