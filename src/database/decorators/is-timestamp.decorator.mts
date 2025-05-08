/**
 * @file Decorators - IsTimestamp
 * @module sneusers/database/decorators/IsTimestamp
 */

import validator from '#database/decorators/is-timestamp.constaint'
import { ValidateBy, type ValidationOptions } from 'class-validator'

/**
 * Require a value to be a [unix timestamp][timestamp].
 *
 * [timestamp]: https://unixtimestamp.com
 *
 * @decorator
 *
 * @this {void}
 *
 * @param {ValidationOptions | undefined} [options]
 *  Validation options
 * @return {PropertyDecorator}
 *  Property decorator
 */
function IsTimestamp(
  this: void,
  options: ValidationOptions | undefined = {}
): PropertyDecorator {
  return ValidateBy(
    Object.assign({ constraints: [options], validator }, validator.options),
    options
  )
}

export default IsTimestamp
