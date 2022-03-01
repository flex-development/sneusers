import { ObjectPlain } from '@flex-development/tutils'

/**
 * @file Utilities - trimmedLowercasedFields
 * @module sneusers/utils/trimmedLowercasedFields/impl
 */

/**
 * Trims and lowercases string fields on `obj`.
 *
 * @param {ObjectPlain} obj - Object with fields to normalize
 * @param {string[]} [skip=[]] - Fields to skip
 * @return {void} Nothing when complete
 */
const trimmedLowercasedFields = (
  obj: ObjectPlain,
  skip: string[] = []
): void => {
  for (const field of Object.keys(obj)) {
    const value = obj[field]

    if (skip.includes(field) || typeof value !== 'string') continue

    obj[field] = value.trim().toLowerCase()
  }
}

export default trimmedLowercasedFields
