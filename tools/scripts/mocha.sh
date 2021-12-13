#!/bin/bash

# Testing Workflow
#
# References:
#
# - https://github.com/istanbuljs/nyc
# - https://github.com/piotrwitek/ts-mocha
# - https://mochajs.org/#command-line-usage

# 1. Set test environment variables
export NODE_ENV=test
export PORT=5000
export TS_NODE_PROJECT=./tsconfig.test.json

# 2. Remove coverage output
trash coverage/

# 3. Run test suites
nyc ts-mocha $@
