#!/bin/bash

# CI Testing Workflow
#
# References:
#
# - https://docs.doppler.com/docs/install-cli#usage
# - https://github.com/istanbuljs/nyc
# - https://github.com/piotrwitek/ts-mocha
# - https://mochajs.org/#command-line-usage

doppler run -c=ci --no-fallback -- nyc ts-mocha $@
