/**
 * @file Test Setup - request
 * @module tests/setup/request
 * @see https://github.com/chaijs/chai-http
 */

import chaiHttp from 'chai-http'
import { chai } from 'vitest'

/**
 * {@linkcode chai} proxy.
 *
 * @const {Chai.ChaiStatic} proxy
 */
const proxy: Chai.ChaiStatic = { ...chai }

// set proxy.request
chaiHttp(proxy, proxy.util)

global.request = proxy.request
