# Contributing Guide

This document aims to describe the workflows and rules used for developing this
project. This includes, but is not limited to:

- how to contribute code (coding standards, testing, documenting source code)
- how to open new issues
- how pull requests are handled

## Overview

[Getting Started](#getting-started)  
[Contributing Code](#contributing-code)  
[Labels](#labels)  
[Opening Issues](#opening-issues)  
[Pull Requests & Code Reviews](#pull-requests-&-code-reviews)  
[Merge Strategies](#merge-strategies)  
[Releasing](#releasing)  
[Integrations](docs/INTEGRATIONS.md)

## Getting Started

### Integrations

Frameworks, libraries, tools, and other integrations used in this project.

#### Dbdocs

[Dbdocs][1] is a tool for creating web-based database documentation using
[database markup language (DBML)][2].

#### Docker

> Docker is an open platform for developing, shipping, and running applications.
> Docker enables you to separate your applications from your infrastructure so
> you can deliver software quickly. With Docker, you can manage your
> infrastructure in the same ways you manage your applications.
>
> \- <https://docs.docker.com/get-started/overview>

Docker containerizes each piece of `sneuser`'s infrastructure.

See [`docker-compose.yml`](docker-compose.yml) for a list of related services.

See [Get Docker][3] for help installing Docker on your platform.

#### Doppler

[Doppler][4] is a tool used for managing environment variables. The [CLI][5] is
used to inject variables into `process.env`.

Contact a maintainer to get added to the `sneusers` [Doppler][4] project.

Afterwards, see the [installation docs][6] to begin managing project secrets.

#### NestJS

> Nest (NestJS) is a framework for building efficient, scalable [Node.js][7]
> server-side applications. It uses progressive JavaScript, is built with and
> fully supports [TypeScript][8] (yet still enables developers to code in pure
> JavaScript) and combines elements of OOP (Object Oriented Programming), FP
> (Functional Programming), and FRP (Functional Reactive Programming).
>
> \- <https://docs.nestjs.com>

#### TypeScript

> TypeScript is **JavaScript with syntax for types.**
>
> TypeScript is a strongly typed programming language that builds on JavaScript,
> giving you better tooling at any scale.
>
> \- <https://typescriptlang.org>

#### Yarn

This project uses Yarn 2. The Yarn configuration for this project can be found
in [`.yarnrc.yml`](.yarnrc.yml).

If you're already using Yarn globally, see the [Yarn 2 Migration docs][9].

### Environment Variables

#### Docker Compose

Default values are located in `.env`.

See [Environment Variables](README.md#environment-variables) in the `README` for
more details.

#### GitHub Actions

| name                       | required | development | test               | production | release            |
| -------------------------- | -------- | ----------- | ------------------ | ---------- | ------------------ |
| `DBDOCS_TOKEN_ADMIN`**\*** | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `DOPPLER_CONFIG`           | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `DOPPLER_ENVIRONMENT`      | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `DOPPLER_PROJECT`          | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `DOPPLER_TOKEN_TEST`       | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `DOPPLER_TOKEN`            | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `GCLOUD_PROJECT`           | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `GITHUB_ACTIONS`           | `false`  | :x:         | :white_check_mark: | :x:        | :white_check_mark: |
| `NODE_ENV`                 | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `NPM_TOKEN_ADMIN`**\***    | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `PAT_CPR_ADMIN`**\***      | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `PAT_GPR_ADMIN`**\***      | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `PAT_REPO_ADMIN`**\***     | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `SSH_HOST`                 | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `SSH_HOST_STG`             | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `SSH_PRIVATE_KEY`          | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |
| `SSH_USER`                 | `true`   | :x:         | :x:                | :x:        | :white_check_mark: |

**\*** GitHub organization secret

Variables are prefixed by `secrets.` in [workflow](.github/workflows/) files.

#### [`package.json`](package.json) scripts

| name               | required | development        | test               | production         | release            |
| ------------------ | -------- | ------------------ | ------------------ | ------------------ | ------------------ |
| `DBDOCS_TOKEN`     | `true`   | :white_check_mark: | :x:                | :x:                | :white_check_mark: |
| `DOPPLER_PROJECT`  | `true`   | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| `DOPPLER_TOKEN`    | `true`   | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| `GH_PAT`           | `true`   | :white_check_mark: | :x:                | :x:                | :white_check_mark: |
| `INIT_CWD`         | `true`   | :x:                | :x:                | :x:                | :white_check_mark: |
| `NPM_TOKEN`        | `true`   | :white_check_mark: | :x:                | :x:                | :white_check_mark: |
| `npm_package_name` | `true`   | :x:                | :x:                | :x:                | :white_check_mark: |

#### Sourcing Environment Variables

Follow the steps below to autosource environment variables:

1. Configure the [Doppler CLI][6]

2. Open `~/.doppler/.doppler.yaml`; copy the value of `token`:

   ```yaml
   scoped:
     /:
       api-host: https://api.doppler.com
       dashboard-host: https://dashboard.doppler.com
       token: secret-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

   or:

   ```yaml
   scoped:
     /:
       api-host: https://api.doppler.com
       dashboard-host: https://dashboard.doppler.com
       token: dp.ct.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. Open a shell startup file

   - e.g: `~/.bash_profile` `~/.bashrc`, `~/.profile`, `~/.zprofile`,
     `~/.zshenv`, `~/.zshrc`

4. Add the following to your chosen shell startup file:

   ```shell
   [ -f $PWD/.env ] && . $PWD/.env
   [ -f $PWD/.env.local ] && . $PWD/.env.local
   
   export DOPPLER_TOKEN=secret-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx # doppler / scope token
   export GH_PAT=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx           # github personal access token with at least read:packages scope
   export NPM_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx        # npm registry auth token
   ```

5. Save shell startup file and re-launch shell

#### Adding New Environment Variables

Follow the steps below to add new environment variables:

1. Update [Usage - Environment Variables](README.md#environment-variables)
2. Add new variables to [Doppler](#doppler)
3. Update [`docker-compose.yml`](docker-compose.yml): `services.app.environment`
4. Update [`docker-cloud.yml`](docker-cloud.yml): `services.app.environment`
5. Update [`EnvironmentVariables`](src/models/environment-variables.model.ts)
6. Update app [configuration](src/config/configuration.ts) module
7. Restart Docker
   - `yarn restart:dev`, `yarn restart:dev -d`
   - `yarn restart`, `yarn restart -d`

### Git Configuration

The examples in this guide contain references to custom Git aliases.

See our [`.gitconfig`](.git/config) for an exhausive list of aliases.

### Clone & Install

```zsh
git clone https://github.com/flex-development/sneusers
cd sneusers
yarn
```

Note that if you have a global Yarn configuration (or any `YARN_*` environment
variables set), an error will be displayed in the terminal if any settings
conflict with the project's Yarn configuration, or the Yarn 2 API.

## Contributing Code

[Husky][10] is used to run Git hooks that locally enforce coding and commit
message standards, as well run tests associated with any files changed since the
last commit.

Any code merged into the [development and production branches](#branching-model)
must confront the following criteria:

- changes should be discussed prior to implementation
- changes have been tested properly
- changes should include documentation updates if applicable
- changes have an associated ticket and pull request

### Branching Model

- Development: `next`
- Production: `main`

### Branch Prefixes

When creating a new branch, the name should match the following format:

```zsh
[prefix]/<TICKET-ID>-<branch_name>
 │           │      │
 │           │      └─⫸ a short, memorable name (possibly the future PR title)
 │           │
 │           └─⫸ check github issue
 │
 └─⫸ bugfix|feat|hotfix|release
```

For example:

```zsh
git chbf 4-authentication
```

will create a new branch titled `feat/4-authentication`.

### Commit Messages

This project follows [Conventional Commit][11] standards and uses
[commitlint][12] to enforce those standards.

This means every commit must conform to the following format:

```zsh
<type>[optional scope]: <description>
 │     │                │
 │     │                └─⫸ summary in present tense; lowercase without period at the end
 │     │
 │     └─⫸ see .commitlintrc.ts
 │
 └─⫸ build|ci|chore|docs|feat|fix|perf|refactor|revert|style|test|wip

[optional body]

[optional footer(s)]
```

`<type>` must be one of the following values:

- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Changes that don't impact external users
- `docs`: Documentation only changes
- `feat`: New features
- `fix`: Bug fixes
- `perf`: Performance improvements
- `refactor`: Code improvements
- `revert`: Revert past changes
- `style`: Changes that do not affect the meaning of the code
- `test`: Adding missing tests or correcting existing tests
- `wip`: Working on changes, but you need to go to bed :wink:

e.g:

- `git docs 'update contributing guide'` -> `docs: update contributing guide`
- `git ac 'refactor(api)!: user queries'` -> `refactor(api)!: user queries`

See [`.commitlintrc.ts`](.commitlintrc.ts) for an exhasutive list of valid
commit scopes and types.

### Code Style

[Prettier][13] is used to format code, and [ESLint][14] to lint files.

#### Prettier Configuration

- [`.prettierrc.cjs`](.prettierrc.cjs)
- [`.prettierignore`](.prettierignore)

#### ESLint Configuration

- [`.eslintrc.cjs`](.eslintrc.cjs)
- [`.eslintignore`](.eslintignore)

### Making Changes

Source code is located in [`src`](src) directory.

The purpose of each file should be documented using the `@file` annotation,
along with an accompanying `@module` annotation.

See the [NestJS docs][15] for help developing NestJS application.

#### Docker Compose Services

- `adminer`: <https://hub.docker.com/_/adminer>
- `nginx`: <https://hub.docker.com/_/nginx>
- `postgres`: <https://hub.docker.com/_/postgres>
- `redis`: <https://hub.docker.com/_/redis>
- `redis-commander`: <https://github.com/joeferner/redis-commander#docker>

### Documentation

- JavaScript & TypeScript: [JSDoc][16], linted with [`eslint-plugin-jsdoc`][17]

Before making a pull request, be sure your code is well documented, as it will
be part of your code review.

### Testing

This project uses a [Mocha][18] x [Chai][19] testing workflow.

- run all test suites: `yarn test`

Husky is configured to run tests before every push. If you need to create a new
issue regarding a test, or need to make a `wip` commit, use Mocha's [inclusive
tests feature][20] to mark your tests or suites as pending.

For more details on testing NestJS applications, see [Testing docs][21].

### Getting Help

If you need help, make note of any issues in their respective files. Whenever
possible, create a test to reproduce the error. Make sure to label your issue as
`type:question` and `status:help-wanted`.

## Labels

This project uses a well-defined list of labels to organize tickets and pull
requests. Most labels are grouped into different categories (identified by the
prefix, eg: `status:`).

A list of labels can be found in [`.github/labels.yml`](.github/labels.yml).

## Opening Issues

Before opening an issue please make sure, you have:

- read the documentation
- searched open issues for an existing issue with the same topic
- search closed issues for a solution or feedback

If you haven't found a related open issue, or feel that a closed issue should be
re-visited, please open a new issue. A well-written issue has the following
traits:

- follows an [issue template](.github/ISSUE_TEMPLATE)
- is [labeled](#labels) appropriately
- contains a well-written summary of the feature, bug, or problem statement
- contains a minimal, inlined code example (if applicable)
- includes links to prior discussion if you've found any

## Pull Requests & Code Reviews

When you're ready to have your changes reviewed, open a pull request against the
`next` branch.

Every opened PR should:

- use [**this template**](.github/PULL_REQUEST_TEMPLATE.md)
- reference it's ticket id
- be [labeled](#labels) appropriately
- be assigned to yourself
- give maintainers push access so quick fixes can be pushed to your branch

### Pull Request URL Format

```zsh
https://github.com/flex-development/sneusers/compare/next...<branch>
```

where `<branch>` is the name of the branch you'd like to merge into `next`.

### Code Reviews

All pull requests are subject to code reviews before being merged into `next`
and `main`. During code reviews, code-style and documentation will be reviewed.

If any changes are requested, those changes will need to be implemented and
approved before the pull request is merged.

## Merge Strategies

In every repository, the `create a merge commit` and `squash and merge` options
are enabled.

- if a PR has a single commit, or the changes across commits are logically
  grouped, use `squash and merge`
- if a PR has multiple commits, not logically grouped, `create a merge commit`

When merging, please make sure to use the following commit message format:

```txt
<type>[optional scope]: <pull-request-title> (#pull-request-n)
 │     │                │
 │     │                └─⫸ check your pull request
 │     │
 │     └─⫸ see .commitlintrc.ts
 │
 └─⫸ build|ci|chore|docs|feat|fix|merge|perf|refactor|release|revert|style|test
```

e.g:

- `refactor(api): github oauth flow #52`
- `merge: update contributing guides and tsconfigs #39`
- `release: @flex-development/sneusers@1.0.0 #13`

## Releasing

This repository is configured to publish packages and releases when a
`release/*` branch is merged.

> Note: Publishing is executed via the
> [Continuous Deployment](./.github/workflows/continous-deployment.yml)
> workflow. This is so invalid or malicious versions cannot be released without
> merging those changes into `next` first.

Before releasing, the following steps must be completed:

1. Schedule a code freeze
2. Create a new `release/*` branch
   - where `*` is `<package.json#name-no-scope>@<package.json#version>`
     - e.g: `sneusers@1.1.0`
   - branch naming conventions **must be followed exactly**. the branch name is
     used to create distribution tags, locate drafted releases, as well as
     generate the correct build and publish commands
3. Decide what version bump the release needs (major, minor, patch)
   - versioning
     - `yarn release` (determines [bumps based on commits][22])
     - `yarn release --first-release`
     - `yarn release --release-as major`
     - `yarn release --release-as minor`
     - `yarn release --release-as patch`
   - a new release will be drafted
4. Open a new pull request from `release/*` into `next`
   - title the PR `release: <package.json#name>@<package.json#version>`
     - e.g: `release: @flex-development/sneusers@1.1.0`
   - link all issues being released
   - after review, `squash and merge` the PR:
     `release: @flex-development/sneusers@1.1.0 (#pull-request-n)`
     - e.g: `release: @flex-development/sneusers@1.1.0 (#3)`
   - once the PR is merged, the deployment workflow will be triggered
   - the maintainer who approved the PR should check to make sure the workflow
     completes all jobs as expected. if successful, the workflow will:
     - **TODO** wait for [`ci`](.github/workflows/ci.yml) job to succeed
     - **TODO** deploy database design doc to [dbdocs][1]
     - **TODO** push container image to the [GitHub Container Registry][23]
     - **TODO** tag latest container image
     - **TODO** upload docker app files to [production vm instance][24]
     - update production branch (merge branch `next` into `main`)
     - publish previously drafted release
     - delete release branch
   - the maintainer who approved the PR should go through linked issues and:
     - make sure all issues are closed and have the label `status:merged`
     - add the `status:released` label to all issues (and PRs)

[1]: https://dbdocs.io
[2]: https://dbml.org/docs
[3]: https://docs.docker.com/get-docker
[4]: https://doppler.com
[5]: https://docs.doppler.com/docs/install-cli#usage
[6]: https://docs.doppler.com/docs/install-cli
[7]: https://nodejs.org
[8]: https://typescriptlang.org
[9]: https://yarnpkg.com/getting-started/migration
[10]: https://github.com/typicode/husky
[11]: https://www.conventionalcommits.org
[12]: https://github.com/conventional-changelog/commitlint
[13]: https://prettier.io
[14]: https://eslint.org
[15]: https://docs.nestjs.com
[16]: https://jsdoc.app
[17]: https://github.com/gajus/eslint-plugin-jsdoc
[18]: https://mochajs.org
[19]: https://www.chaijs.com
[20]: https://mochajs.org/#inclusive-tests
[21]: https://docs.nestjs.com/fundamentals/testing
[22]: https://www.conventionalcommits.org/en/v1.0.0
[23]:
  https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry
[24]: https://cloud.google.com/compute
