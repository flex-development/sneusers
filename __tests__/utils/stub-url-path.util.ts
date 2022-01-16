import { NumberString, ObjectPlain } from '@flex-development/tutils'
import qs from 'query-string'

/**
 * @file Global Test Utilities - stubURLPath
 * @module tests/utils/stubURLPath
 */

/**
 * Generates a URL path with optional query parameters.
 *
 * @param {string} [path=''] - URL path
 * @param {ObjectPlain} [query] - Query parameters
 * @return {string} Test URL path with stringified query params
 */
const stubURLPath = (path: NumberString = '', query?: ObjectPlain): string => {
  let url: string = `/${path}`

  if (url.startsWith('//')) url = url.replace('//', '/')
  if (query) url = `${url}?${qs.stringify(query)}`

  return url
}

export default stubURLPath
