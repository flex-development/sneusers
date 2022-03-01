/**
 * @file Utilities - capitalize
 * @module sneusers/utils/capitalize/impl
 */

/**
 * Capitalizes `value`.
 *
 * @param {string} value - String value to capitalize
 * @return {string} Capitalized version of `value`
 */
const capitalize = (value: string): string => {
  return [value.charAt(0).toUpperCase(), value.slice(1, value.length)].join('')
}

export default capitalize
