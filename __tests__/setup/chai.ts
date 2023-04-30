/**
 * @file Test Setup - chai
 * @module tests/setup/chai
 * @see https://chaijs.com
 */

import chaiEach from 'chai-each'
import chaiHttp from 'chai-http'
import { chai } from 'vitest'

/**
 * initialize chai plugins.
 *
 * @see https://github.com/jamesthomasonjr/chai-each
 * @see https://github.com/chaijs/chai-http
 */
chai.use(chaiEach)
chai.use(chaiHttp)
