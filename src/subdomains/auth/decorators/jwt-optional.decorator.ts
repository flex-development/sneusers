import { CustomDecorator, SetMetadata } from '@nestjs/common'
import { AuthMetadataKey } from '../enums'

/**
 * @file Auth Subdomain Decorators - JwtOptional
 * @module sneusers/subdomains/auth/decorators/JwtOptional
 */

/**
 * Sets {@link AuthMetadataKey.JWT_OPTIONAL}.
 *
 * @return {CustomDecorator<AuthMetadataKey>} Custom decorator
 */
const JwtOptional = (): CustomDecorator<AuthMetadataKey> => {
  return SetMetadata(AuthMetadataKey.JWT_OPTIONAL, true)
}

export default JwtOptional
