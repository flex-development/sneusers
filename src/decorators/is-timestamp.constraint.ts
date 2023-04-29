/**
 * @file Decorators - IsTimestampConstraint
 * @module sneusers/decorators/IsTimestampConstraint
 */

import { isNumber } from '@flex-development/tutils'
import {
  ValidatorConstraint,
  buildMessage,
  type ValidatorConstraintInterface as IValidatorConstraint,
  type ValidationArguments,
  type ValidationOptions
} from 'class-validator'

/**
 * [Unix timestamp][1] validator.
 *
 * [1]: https://unixtimestamp.com
 *
 * @class
 * @implements {IValidatorConstraint}
 */
@ValidatorConstraint(IsTimestampConstraint.options)
class IsTimestampConstraint implements IValidatorConstraint {
  /**
   * Returns an object containing validator constraint options.
   *
   * @public
   * @static
   *
   * @return {{ async: boolean; name: string }} Validator constraint options
   */
  public static get options(): { async: boolean; name: string } {
    return { async: false, name: 'isTimestamp' }
  }

  /**
   * Returns the default validation error message to use if validation fails.
   *
   * @see {@linkcode ValidationArguments}
   *
   * @public
   *
   * @param {ValidationArguments} args - Validation arguments
   * @return {string} Default validation error message
   */
  public defaultMessage(args: ValidationArguments): string {
    return buildMessage((prefix: string): string => {
      return prefix + '$property must be a valid unix timestamp'
    }, args.constraints.at(0) as ValidationOptions | undefined)(args)
  }

  /**
   * Checks if the given `value` is a [unix timestamp][1].
   *
   * [1]: https://unixtimestamp.com
   *
   * @public
   *
   * @param {unknown} value - Property value to validate
   * @return {value is number} Validation result
   */
  public validate(value: unknown): value is number {
    return isNumber(value) && new Date(value).getTime() > 0
  }
}

export default IsTimestampConstraint
