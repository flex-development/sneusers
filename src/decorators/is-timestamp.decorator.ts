/**
 * @file Decorators - IsTimestamp
 * @module sneusers/decorators/IsTimestamp
 */

import { ValidateBy, type ValidationOptions } from 'class-validator'
import validator from './is-timestamp.constraint'

/**
 * Ensures a value is a [unix timestamp][1].
 *
 * [1]: https://unixtimestamp.com
 *
 * @see {@linkcode ValidationOptions}
 *
 * @decorator
 *
 * @param {ValidationOptions} [options={}] - Validation options
 * @return {PropertyDecorator} Property decorator
 */
const IsTimestamp = (options: ValidationOptions = {}): PropertyDecorator => {
  return ValidateBy(
    Object.assign({ constraints: [options], validator }, validator.options),
    options
  )
}

export default IsTimestamp
