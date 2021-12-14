#!/bin/bash

# Testing Workflow
#
# References:
#
# - https://github.com/istanbuljs/nyc
# - https://github.com/piotrwitek/ts-mocha
# - https://mochajs.org/#command-line-usage

# 1. Load default environment variables
. ./.env ./.env.defaults

# 2. Set test environment variables
export DEBUG='superagent'
export DB_AUTO_LOAD_MODELS=false
export DB_LOGGING=false
export NODE_ENV=test
export PORT=5000
export TS_NODE_PROJECT=./tsconfig.test.json

# 3. Remove coverage output
trash coverage/

# 4. Run test suites
nyc ts-mocha $@
