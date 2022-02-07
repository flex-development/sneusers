import { ObjectPlain } from '@flex-development/tutils'
import validator from '@sneusers/constraints/is.constraint'
import { IsOptions } from '@sneusers/interfaces'
import { ValidationMessage } from '@sneusers/types'
import type { ValidateByOptions } from 'class-validator'
import { ValidateBy } from 'class-validator'

/**
 * @file Decorators - Is
 * @module sneusers/decorators/Is
 */

/**
 * Custom decorator to check if a value is of a certain type.
 *
 * @see https://github.com/sindresorhus/is#isvalue
 *
 * @param {IsOptions} [options={}] - Validation options
 * @param {boolean} [options.always] - Perform validation and ignore `groups`
 * @param {boolean} [options.each] - Validate array items or object properties
 * @param {ObjectPlain} [options.context] - Custom validation context
 * @param {string[]} [options.groups] - Groups used for this validation
 * @param {ValidationMessage} [options.message] - Custom error message
 * @param {string[]} [options.types] - List of allowed types
 * @return {PropertyDecorator} Property decorator
 */
const Is = (options: IsOptions = {}): PropertyDecorator => {
  const validateByOptions: ValidateByOptions = {
    async: validator.options.async,
    constraints: [options],
    name: validator.NAME,
    validator
  }

  return ValidateBy(validateByOptions, options)
}

export default Is
