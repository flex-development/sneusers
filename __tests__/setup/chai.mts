/**
 * @file Test Setup - chai
 * @module tests/setup/chai
 * @see https://chaijs.com
 */

import each from '#tests/plugins/each'
import http from 'chai-http'
import { chai } from 'vitest'

chai.use(each)
chai.use(http)
