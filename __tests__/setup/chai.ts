/**
 * @file Test Setup - chai
 * @module tests/setup/chai
 * @see https://chaijs.com
 */

import chaiHttp from 'chai-http'
import { chai } from 'vitest'

/**
 * initialize chai plugins.
 *
 * @see https://github.com/chaijs/chai-http
 */
chai.use(chaiHttp)
