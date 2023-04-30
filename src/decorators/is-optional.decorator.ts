/**
 * @file Decorators - IsOptional
 * @module sneusers/decorators/IsOptional
 */

import { isUndefined, type ObjectUnknown } from '@flex-development/tutils'
import {
  getMetadataStorage,
  ValidationTypes,
  type ValidationOptions
} from 'class-validator'
import { ValidationMetadata } from 'class-validator/esm2015/metadata/ValidationMetadata'

/**
 * Ignores all validators if a property value is `undefined`.
 *
 * @param {ValidationOptions} [options] - Validation options
 * @return {PropertyDecorator} Property decorator
 */
const IsOptional = (options: ValidationOptions = {}): PropertyDecorator => {
  return function (obj: object, name: string | symbol): void {
    getMetadataStorage().addValidationMetadata(
      new ValidationMetadata({
        constraints: [(obj: ObjectUnknown) => !isUndefined(obj[name])],
        propertyName: name as string,
        target: obj.constructor,
        type: ValidationTypes.CONDITIONAL_VALIDATION,
        validationOptions: options
      })
    )
  }
}

export default IsOptional
