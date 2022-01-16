/**
 * @file Utilities - isUnixTimestamp
 * @module sneusers/utils/isUnixTimestamp/impl
 */

/**
 * Checks if `timestamp` is a valid [unix timestamp][1].
 *
 * [1]: https://unixtimestamp.com
 *
 * @param {any} timestamp - Value to check
 * @return {boolean} `true` if unix timestamp, `false` otherwise
 */
const isUnixTimestamp = (timestamp: any): boolean => {
  return typeof timestamp === 'number' && new Date(timestamp).getTime() > 0
}

export default isUnixTimestamp
