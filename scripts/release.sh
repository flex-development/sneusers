#!/bin/sh

# Local Release Workflow
#
# 1. run typecheck
# 2. run tests
# 3. build project
# 4. get new project version
# 5. get release branch name
# 6. switch to release branch
# 7. stage changes
# 8. commit changes
# 9. push release branch to origin
# 10. create pull request
#
# References:
#
# - https://cli.github.com/manual/gh_pr_create

yarn typecheck
yarn test:cov
yarn build:app
VERSION=$(jq .version package.json -r)
RELEASE_BRANCH=release/$VERSION
git switch -c $RELEASE_BRANCH
git add .
git commit -s -m "release: $(jq .tagPrefix package.json -r)$VERSION"
git push origin -u --no-verify $RELEASE_BRANCH
gh pr create --assignee @me --label scope:release --web
