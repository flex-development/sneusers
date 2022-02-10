import { applyDecorators } from '@nestjs/common'
import type { ApiParamOptions } from '@nestjs/swagger'
import { ApiForbiddenResponse, ApiHeader, ApiParam } from '@nestjs/swagger'
import { Exception } from '@sneusers/exceptions'

/**
 * @file Decorators - ApiCsrfProtection
 * @module sneusers/decorators/ApiCsrfProtection
 */

/**
 * Documents csrf requirements.
 *
 * @see https://github.com/expressjs/csurf
 *
 * @return {ReturnType<typeof applyDecorators>} Decorator function
 */
const ApiCsrfProtection = (): ReturnType<typeof applyDecorators> => {
  return applyDecorators(
    ApiParam({
      description: 'csrf token secret',
      in: 'cookie',
      name: '_csrf',
      required: true,
      schema: { type: 'string' },
      type: String
    } as ApiParamOptions),
    ApiHeader({
      allowEmptyValue: false,
      description: 'csrf token',
      name: 'csrf-token | xsrf-token | x-csrf-token | x-xsrf-token',
      required: true,
      schema: { type: 'string' }
    }),
    ApiForbiddenResponse({ description: 'Invalid csrf token', type: Exception })
  )
}

export default ApiCsrfProtection
