#!/bin/bash

# Testing Workflow
#
# References:
#
# - https://docs.doppler.com/docs/install-cli#usage
# - https://github.com/istanbuljs/nyc
# - https://github.com/piotrwitek/ts-mocha
# - https://mochajs.org/#command-line-usage

# 1. Create ephemeral service token for Doppler
if [[ $DOPPLER_TOKEN == "" || $DOPPLER_TOKEN = secret-* ]]; then
  export DOPPLER_TOKEN=$(doppler configs tokens create $(doppler configure get project --plain) --config=test --max-age=1m --plain --no-read-env)
fi

# 2. Remove coverage output
trash coverage/

# 3. Run test suites
doppler run -c=test --no-fallback -- nyc ts-mocha $@
