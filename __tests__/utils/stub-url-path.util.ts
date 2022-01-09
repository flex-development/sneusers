import { NumberString, ObjectPlain } from '@flex-development/tutils'

/**
 * @file Global Test Utilities - stubURLPath
 * @module tests/utils/stubURLPath
 */

/**
 * Generates a URL path with optional query parameters.
 *
 * @param {string} [path=''] - URL path
 * @param {ObjectPlain | string | string[][]} [query] - Query parameters
 * @return {string} Test URL path with stringified query params
 */
const stubURLPath = (
  path: NumberString = '',
  query?: ObjectPlain | string | string[][]
): string => {
  let url: string = `/${path}`

  if (url.startsWith('//')) url = url.replace('//', '/')
  if (query) url = `${url}?${new URLSearchParams(query).toString()}`

  return url
}

export default stubURLPath
