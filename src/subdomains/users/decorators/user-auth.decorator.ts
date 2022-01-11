import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Exception } from '@sneusers/exceptions'
import { JwtAuthGuard } from '@sneusers/subdomains/auth/guards'
import { UsersMetadataKey } from '@sneusers/subdomains/users/enums'

/**
 * @file Users Subdomain Decorators - UserAuth
 * @module sneusers/subdomains/users/decorators/UserAuth
 */

/**
 * Applies user authentication decorators.
 *
 * @param {boolean | 'optional'} [optional=false] - Don't require authentication
 * @return {ReturnType<typeof applyDecorators>} Decorator function
 */
const UserAuth = (
  optional: boolean | 'optional' = false
): ReturnType<typeof applyDecorators> => {
  const AUTH_OPTIONAL = optional === 'optional' || optional === true

  return applyDecorators(
    SetMetadata(UsersMetadataKey.AUTH_OPTIONAL, AUTH_OPTIONAL),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: Exception })
  )
}

export default UserAuth
