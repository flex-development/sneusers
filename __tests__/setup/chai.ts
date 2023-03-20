/**
 * @file Test Setup - chai
 * @module tests/setup/chai
 * @see https://chaijs.com
 */

import chaiHttp from 'chai-http'
import { chai } from 'vitest'

// configure chai
chai.config.includeStack = true
chai.config.truncateThreshold = 0

/**
 * initialize chai plugins.
 *
 * @see https://github.com/chaijs/chai-http
 */
chai.use(chaiHttp)
