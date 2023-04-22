/**
 * @file Test Utilities - url
 * @module tests/utils/url
 */

import type { ObjectPlain } from '@flex-development/tutils'
import qs from 'query-string'

/**
 * Generates a request URL path.
 *
 * @param {number | string} [pathname=''] - URL pathname
 * @param {ObjectPlain} [query={}] - Query parameters
 * @return {string} Request URL path
 */
const url = (pathname: number | string, query: ObjectPlain = {}): string => {
  pathname = `/${pathname}?${qs.stringify(query)}`
  return pathname.replace(/^\/\//, '/').replace(/\?$/, '')
}

export default url
