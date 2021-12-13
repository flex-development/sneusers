import type { NumberString, ObjectPlain } from '@flex-development/tutils'
import isNIL from '@flex-development/tutils/guards/is-nil.guard'
import merge from 'lodash.mergewith'
import type { ParsedQuery as Query } from 'query-string'
import qs from 'query-string'

/**
 * @file Global Test Utilities - stubURLPath
 * @module tests/utils/stubURLPath
 */

/**
 * Generates a URL path with optional query parameters.
 *
 * @param {NumberString | ObjectPlain | Query} [poq] - URL path or query params
 * @param {ObjectPlain} [query] - Query parameters
 * @return {string} Test URL path with stringified query params
 */
const stubURLPath = (
  poq?: NumberString | ObjectPlain | Query,
  query?: ObjectPlain
): string => {
  if (!poq || typeof poq === 'number' || typeof poq === 'string') {
    const querystring = query ? `?${qs.stringify(query)}` : ''

    poq = `${isNIL(poq) ? '' : poq}`
    if (poq[0] === '/') poq = poq.slice(1, poq.length)

    return `/${poq || ''}${querystring}`
  }

  return `/?${qs.stringify(merge(poq, query))}`
}

export default stubURLPath
