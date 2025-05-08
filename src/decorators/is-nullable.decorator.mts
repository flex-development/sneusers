/**
 * @file Decorators - IsNullable
 * @module sneusers/decorators/IsNullable
 */

import {
  getMetadataStorage,
  ValidationTypes,
  type ValidationOptions
} from 'class-validator'
import {
  ValidationMetadata
} from 'class-validator/esm2015/metadata/ValidationMetadata'

/**
 * Allow a value to be `null`.
 *
 * @decorator
 *
 * @this {void}
 *
 * @param {ValidationOptions | null | undefined} [options]
 *  Validation options
 * @return {PropertyDecorator}
 *  Property decorator
 */
function IsNullable(
  this: void,
  options?: ValidationOptions | null | undefined
): PropertyDecorator {
  /**
   * @param {object} target
   *  The target object on which to define metadata
   * @param {string | symbol} prop
   *  Property key
   * @return {undefined}
   */
  return (target: Object, prop: string | symbol): undefined => {
    return void getMetadataStorage().addValidationMetadata(
      new ValidationMetadata({
        constraints: [(obj: Record<PropertyKey, any>) => obj[prop] !== null],
        propertyName: prop as string,
        target: target.constructor,
        type: ValidationTypes.CONDITIONAL_VALIDATION,
        validationOptions: { ...options }
      })
    )
  }
}

export default IsNullable
