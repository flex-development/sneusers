/**
 * @file Providers - ValidationProvider
 * @module sneusers/providers/ValidationProvider
 */

import type { ValueProvider } from '@nestjs/common'
import { HttpStatus, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'

/**
 * Validation provider.
 *
 * @see https://docs.nestjs.com/techniques/validation
 *
 * @const {ValueProvider<ValidationPipe>} ValidationProvider
 */
const ValidationProvider: ValueProvider<ValidationPipe> = {
  provide: APP_PIPE,
  useValue: new ValidationPipe({
    enableDebugMessages: true,
    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    forbidUnknownValues: true,
    skipNullProperties: false,
    skipUndefinedProperties: false,
    stopAtFirstError: false,
    transform: true,
    transformOptions: { exposeUnsetFields: false },
    validateCustomDecorators: true,
    validationError: { target: false },
    whitelist: true
  })
}

export default ValidationProvider
