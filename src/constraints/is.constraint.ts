import is from '@sindresorhus/is'
import { IsOptions } from '@sneusers/interfaces'
import { ValidationMessage, ValidatorConstraintOptions } from '@sneusers/types'
import {
  buildMessage,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

/**
 * @file Constraint - IsConstraint
 * @module sneusers/constraints/IsConstraint
 */

@ValidatorConstraint(IsConstraint.options)
class IsConstraint implements ValidatorConstraintInterface {
  /**
   * @static
   * @readonly
   * @property {string} NAME - Constraint name
   */
  static readonly NAME: string = 'is'

  /**
   * @static
   * @readonly
   * @property {ValidatorConstraintOptions} options - Custom constraint options
   */
  static readonly options: ValidatorConstraintOptions = {
    async: false,
    name: IsConstraint.NAME
  }

  /**
   * Returns the default error message if validation fails.
   *
   * @param {ValidationArguments} args - Message builder arguments
   * @param {any[]} args.constraints - Validator constraints
   * @param {IsOptions} args.constraints.0 - Validation options
   * @param {ValidationMessage} [args.constraints.0.message] - Error message
   * @return {string} Default error message
   */
  defaultMessage(args: ValidationArguments): string {
    const options = args.constraints[0] as IsOptions

    const description = options.each ? 'must be of type' : 'type must be one of'
    let message = `$property ${description} [${options.types || ''}]`
    message += `; received: ${options.context[IsConstraint.NAME].error.type}`

    return buildMessage(prefix => `${prefix}${message}`, options)()
  }

  /**
   * Checks if `value` is an allowed type.
   *
   * @see https://github.com/sindresorhus/is#isvalue
   *
   * @param {any} value - Value to test against constraint
   * @param {ValidationArguments} args - Message builder arguments
   * @param {any[]} [args.constraints] - Validator constraints
   * @param {IsOptions} [args.constraints.0] - Validation options
   * @param {string[]} [args.constraints.0.types] - List of allowed types
   * @return {boolean} `true` if `value` is allowed type, `false` otherwise
   */
  validate(value: any, args: ValidationArguments): boolean {
    if (!args.constraints[0].context) args.constraints[0].context = {}

    const options = args.constraints[0] as IsOptions
    const type = is(value)

    if (options.types?.includes(type)) return true

    args.constraints[0].context[IsConstraint.NAME] = { error: { type } }
    return false
  }
}

export default IsConstraint
