#!/bin/bash

# Testing Workflow
#
# References:
#
# - https://docs.doppler.com/docs/install-cli#usage
# - https://github.com/sindresorhus/trash-cli
# - https://github.com/istanbuljs/nyc
# - https://github.com/piotrwitek/ts-mocha
# - https://mochajs.org/#command-line-usage

# 1. Remove stale coverage output
trash coverage/

# 2. Run test suites
doppler run -c=test --no-fallback -- nyc ts-mocha $@
