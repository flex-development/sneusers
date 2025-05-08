/**
 * @file Decorators - IsTimestampConstraint
 * @module sneusers/database/decorators/IsTimestampConstraint
 */

import {
  buildMessage,
  ValidatorConstraint,
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
   * Get an object containing validator constraint options.
   *
   * @public
   * @static
   *
   * @return {{ async: boolean; name: string }}
   *  Validator constraint options
   */
  public static get options(): { async: boolean; name: string } {
    return { async: false, name: 'isTimestamp' }
  }

  /**
   * Get a validation error message.
   *
   * @public
   * @instance
   *
   * @param {ValidationArguments} args
   *  Validation arguments
   * @return {string}
   *  Validation error message
   */
  public defaultMessage(args: ValidationArguments): string {
    return buildMessage((prefix: string): string => {
      return prefix + '$property must be a unix timestamp'
    }, args.constraints[0] as ValidationOptions | undefined)(args)
  }

  /**
   * Checks if `value` is a [unix timestamp][timestamp].
   *
   * [timestamp]: https://unixtimestamp.com
   *
   * @public
   * @instance
   *
   * @param {unknown} value
   *  The thing to check
   * @return {value is number}
   *  `true` if `value` is a timestamp, `false` otherwise
   */
  public validate(value: unknown): value is number {
    return typeof value === 'number' && new Date(value).getTime() > 0
  }
}

export default IsTimestampConstraint
