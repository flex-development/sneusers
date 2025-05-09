/**
 * @file Pipes - TransformPipe
 * @module sneusers/pipes/Transform
 */

import { constant } from '@flex-development/tutils'
import {
  Injectable,
  Optional,
  ValidationPipe
} from '@nestjs/common'
import type { ValidatorPackage } from '@nestjs/common/interfaces/external/validator-package.interface'
import type { ClassTransformOptions } from 'class-transformer'
import * as transformerPackage from 'class-transformer'

/**
 * Transform plain objects into class instances.
 *
 * @see https://github.com/typestack/class-transformer
 *
 * @class
 * @extends {ValidationPipe}
 */
@Injectable()
class TransformPipe extends ValidationPipe {
  /**
   * Transformation options.
   *
   * @protected
   * @override
   * @instance
   * @member {ClassTransformOptions} transformOptions
   */
  declare protected transformOptions: ClassTransformOptions

  /**
   * Create a new transform pipe.
   *
   * @param {ClassTransformOptions | null | undefined} [options]
   *  Transform options
   */
  constructor(@Optional() options?: ClassTransformOptions | null | undefined) {
    super({
      transform: true,
      transformOptions: { ...options },
      transformerPackage
    })
  }

  /**
   * @protected
   * @instance
   * @override
   *
   * @return {ValidatorPackage}
   *  Dummy validator package
   */
  protected override loadValidator(): ValidatorPackage {
    return { validate: constant([]) }
  }
}

export default TransformPipe
