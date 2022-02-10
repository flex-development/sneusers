import { applyDecorators } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Exception } from '@sneusers/exceptions'

/**
 * @file Decorators - ApiTokenAuth
 * @module sneusers/decorators/ApiTokenAuth
 */

/**
 * Documents bearer tokens.
 *
 * @return {ReturnType<typeof applyDecorators>} Decorator function
 */
const ApiTokenAuth = (): ReturnType<typeof applyDecorators> => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: Exception })
  )
}

export default ApiTokenAuth
