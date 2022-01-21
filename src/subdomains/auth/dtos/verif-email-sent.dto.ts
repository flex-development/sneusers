import { ApiProperty } from '@nestjs/swagger'
import type { UserEmailSentDTO } from '@sneusers/subdomains/users/dtos'
import type { User } from '@sneusers/subdomains/users/entities'

/**
 * @file Auth Subdomain DTOs - VerifEmailSentDTO
 * @module sneusers/subdomains/auth/models/VerifEmailSentDTO
 */

/**
 * Successful verification email-sent response.
 */
class VerifEmailSentDTO {
  @ApiProperty({ description: 'Email sent', type: String })
  email: UserEmailSentDTO['email']['messageId']

  @ApiProperty({ description: 'Email recipient', type: Number })
  user: User['id']
}

export default VerifEmailSentDTO
