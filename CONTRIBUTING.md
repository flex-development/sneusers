# Contributing Guide

This document aims to describe the workflows and rules used for developing this project.

This includes, but is not limited to:

- how to contribute code (coding standards, testing, documenting source code)
- how pull requests are handled
- how to file bug reports

## Getting Started

Follow the steps below to setup your local development environment:

1. Clone repository

   ```sh
   git clone https://github.com/flex-development/sneusers
   cd sneusers
   ```

2. Install binaries with [Homebrew][]

   ```sh
   brew bundle --file ./Brewfile
   brew install terminal-notifier # macos only
   ```

3. [Configure commit signing][gpg-commit-signature-verification]

4. Update `~/.gitconfig`

   ```sh
   git config --global commit.gpgsign true
   git config --global tag.gpgsign true
   git config --global user.email <email>
   git config --global user.name <name>
   git config --global user.username <username>
   ```

   See [`.gitconfig`](.github/.gitconfig) for a global Git config example.

5. Install dependencies

   ```sh
   bun install
   ```

   **Note**: This project uses [bun][].

6. [ZSH][ohmyzsh] setup

7. Update `$ZDOTDIR/.zprofile`:

   ```sh
   # PATH
   # 1. local node_modules
   [ -d $PWD/node_modules/.bin ] && export PATH=$PWD/node_modules/.bin:$PATH

   # DOTENV ZSH PLUGIN
   # https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/dotenv
   export ZSH_DOTENV_FILE=.env.zsh

   # GIT
   # https://gist.github.com/troyfontaine/18c9146295168ee9ca2b30c00bd1b41e
   export GIT_EMAIL=$(git config user.email)
   export GIT_NAME=$(git config user.name)
   export GIT_USERNAME=$(git config user.username)
   export GPG_TTY=$(tty)

   # HOMEBREW
   # https://brew.sh
   export HOMEBREW_PREFIX=$(brew --prefix)
   ```

8. Load `dotenv` plugin via `$ZDOTDIR/.zshrc`:

   ```zsh
   plugins=(dotenv)
   ```

9. Reload shell

   ```sh
   exec $SHELL
   ```

### Environment Variables

| name                |
| ------------------- |
| `GITHUB_ENV`        |
| `HOMEBREW_BREWFILE` |
| `HOST`              |
| `NEST_DEBUG`        |
| `NODE_ENV`          |
| `PORT`              |
| `ZSH_DOTENV_FILE`   |

#### GitHub Actions

Secrets are prefixed by `secrets.` in [workflow](.github/workflows/) files.

### Git Config

The examples in this guide contain references to custom Git aliases.

See [`.github/.gitconfig`](.github/.gitconfig) for an exhaustive list.

## Contributing Code

[Husky][] is used to locally enforce coding and commit message standards, as well as run tests pre-push.

Any code merged into the [trunk](#branching-model) must confront the following criteria:

- changes should be discussed prior to implementation
- changes have been tested properly
- changes should include documentation updates if applicable
- changes have an associated ticket and pull request

### Branching Model

This project follows a [Trunk Based Development][tbd] workflow, specifically the [short-lived branch
style][tbd-short-lived-feature-branches].

- Trunk Branch: `main`
- Short-Lived Branches: `feat/*`, `hotfix/*`, `release/*`

#### Branch Naming Conventions

When creating a new branch, the name should match the following format:

```zsh
[prefix]/<issue-number>-<branch_name>
 │        │              │
 │        │              │
 │        │              │
 │        │              └─⫸ a short, memorable name
 │        │
 │        └─⫸ check github issue
 │
 └─⫸ feat|feat/fix|hotfix|release
```

### Commit Messages

This project follows [Conventional Commit][conventionalcommits] standards and uses [commitlint][] to enforce those
standards.

This means every commit must conform to the following format:

```zsh
<type>[scope][!]: <description>
 │     │      │    │
 │     │      │    │
 │     │      │    └─⫸ summary in present tense (lowercase without punctuation)
 │     │      │
 │     │      └─⫸ optional breaking change flag
 │     │
 │     └─⫸ see .commitlintrc.ts
 │
 └─⫸ build|ci|chore|docs|feat|fix|perf|refactor|revert|style|test|wip

[body]

[BREAKING-CHANGE: <change>]

[footer(s)]
```

`<type>` must be one of the following values:

- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI/CD configuration files and scripts
- `chore`: Housekeeping tasks / changes that don't impact external users
- `docs`: Documentation improvements
- `feat`: New features
- `fix`: Bug fixes
- `perf`: Performance improvements
- `refactor`: Code improvements
- `revert`: Revert past changes
- `style`: Changes that do not affect the meaning of the code
- `test`: Change that impact the test suite
- `wip`: Working on changes, but you need to go to bed \:wink:

e.g:

- `build(deps-dev): bump cspell from 6.7.0 to 6.8.0`
- `perf: lighten initial load`

See [`.commitlintrc.ts`](.commitlintrc.ts) to view all commit guidelines.

### Code Style

[dprint][] is used to format code and [ESLint][] to lint files.

- [`.dprint.jsonc`](.dprint.jsonc)
- [`eslint.config.mjs`](eslint.config.mjs)

### Making Changes

Source code is located in [`src`](src) directory.

### Documentation

- JavaScript & TypeScript: [JSDoc][]; linted with [`eslint-plugin-jsdoc`][eslint-plugin-jsdoc]

Before making a pull request, be sure your code is well documented, as it will be part of your code review.

### Testing

This project uses [Vitest][] to run tests.

[Husky](#contributing-code) is configured to run tests against changed files.

Be sure to use [`it.skip`][vitest-test-skip] or [`it.todo`][vitest-test-todo] where appropriate.

#### Running Tests

- `bun run test`
- `bun run test:cov`
- `bun run typecheck`

### Getting Help

If you need help, make note of any issues in their respective files in the form of a [JSDoc comment][jsdoc]. If you need
help with a test, don't forget to use [`it.skip`][vitest-test-skip] and/or [`it.todo`][vitest-test-todo]. Afterwards,
[start a discussion in the Q\&A category][qa].

## Labels

This project uses a well-defined list of labels to organize issues and pull requests. Most labels are scoped (i.e:
`status:`).

A list of labels can be found in [`.github/infrastructure.yml`](.github/infrastructure.yml).

## Opening Issues

Before opening an issue, make sure you have:

- read the documentation
- checked that the issue hasn't already been filed by searching open issues
- searched closed issues for solution(s) or feedback

If you haven't found a related open issue, or feel that a closed issue should be re-visited, open a new issue.

A well-written issue

- contains a well-written summary of the bug, feature, or improvement
- contains a [minimal, reproducible example][mre] (if applicable)
- includes links to related articles and documentation (if any)
- includes an emoji in the title \:wink:

## Pull Requests

When you're ready to submit your changes, open a pull request (PR) against `main`:

```sh
https://github.com/flex-development/sneusers/compare/main...$branch
```

where `$branch` is the name of the branch you'd like to merge into `main`.

All PRs are subject to review before being merged into `main`.

Before submitting a PR, be sure you have:

- performed a self-review of your changes
- added and/or updated relevant tests
- added and/or updated relevant documentation

Every PR you open should:

- [follow this template](.github/PULL_REQUEST_TEMPLATE.md)
- [be titled appropriately](#pull-request-titles)

### Pull Request Titles

To keep in line with [commit message standards](#commit-messages) after PRs are merged, PR titles are expected to adhere
to the same rules.

## Merge Strategies

In every repository, the `rebase and merge` and `squash and merge` options are enabled.

- **rebase and merge**: PR has one commit or commits that are not grouped
- **squash and merge**: PR has one commit or a group of commits

When squashing, be sure to follow [commit message standards](#commit-messages):

```zsh
<type>[scope][!]:<pull-request-title> (#pull-request-n)
 │     │      │   │                    │
 │     │      │   │                    │
 │     │      │   │                    └─⫸ check pull request
 │     │      │   │
 │     │      │   └─⫸ lowercase title
 │     │      │
 │     │      └─⫸ optional breaking change flag
 │     │
 │     └─⫸ see .commitlintrc.ts
 │
 └─⫸ build|ci|chore|docs|feat|fix|perf|refactor|release|revert|style|test
```

e.g:

- `ci(workflows): simplify release workflow #24`
- `refactor: project architecture #21`
- `release: 1.0.0 #13`

## Deployment

> Note: Deployment and release publication is executed via GitHub workflow.\
> This is so invalid or malicious versions cannot be published without merging those changes into `main` first.

1. Schedule a code freeze
2. Get a version bump recommendation
   - `grease bump --recommend`
3. Create release chore commit
   - `bun run release <new-version>`
   - `bun run release major`
   - `bun run release minor`
   - `bun run release patch`
   - `bun run release premajor --preid <dist-tag>`
   - `bun run release preminor --preid <dist-tag>`
   - `bun run release prepatch --preid <dist-tag>`
   - `bun run release prerelease --preid <dist-tag>`
4. Push release chore commit
5. Monitor workflows
   1. [`release-chore`](.github/workflows/release-chore.yml)
      - create release branch
      - bump manifest version
      - add changelog entry for new release
      - create release pr
   2. [`release`](.github/workflows/release.yml)
      - create and push new tag
      - create and publish github release
   3. **TODO**: [`publish`](.github/workflows/publish.yml)

[bun]: https://bun.sh

[commitlint]: https://github.com/conventional-changelog/commitlint

[conventionalcommits]: https://conventionalcommits.org

[dprint]: https://dprint.dev

[eslint-plugin-jsdoc]: https://github.com/gajus/eslint-plugin-jsdoc

[eslint]: https://eslint.org

<!-- [gcr]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry -->

[gpg-commit-signature-verification]: https://docs.github.com/authentication/managing-commit-signature-verification/about-commit-signature-verification#gpg-commit-signature-verification

[homebrew]: https://brew.sh

[husky]: https://github.com/typicode/husky

[jsdoc]: https://jsdoc.app

[mre]: https://stackoverflow.com/help/minimal-reproducible-example

[ohmyzsh]: https://github.com/ohmyzsh/ohmyzsh

[qa]: https://github.com/flex-development/sneusers/discussions/new?category=q-a

[tbd-short-lived-feature-branches]: https://trunkbaseddevelopment.com/styles/#short-lived-feature-branches

[tbd]: https://trunkbaseddevelopment.com

[vitest-test-skip]: https://vitest.dev/api/#test-skip

[vitest-test-todo]: https://vitest.dev/api/#test-todo

[vitest]: https://vitest.dev
