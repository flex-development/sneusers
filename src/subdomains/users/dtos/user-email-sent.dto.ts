import { ApiProperty } from '@nestjs/swagger'
import { EmailSentDTO } from '@sneusers/modules/email/dtos'
import { User } from '../entities'
import UserDTO from './user.dto'

/**
 * @file User Subdomain DTOs - UserEmailSentDTO
 * @module sneusers/subdomains/users/dtos/UserEmailSentDTO
 */

/**
 * Successful user email-sent response.
 */
class UserEmailSentDTO {
  @ApiProperty({ description: 'Email sent', type: EmailSentDTO })
  email: EmailSentDTO

  @ApiProperty({ description: 'Email recipient', type: UserDTO })
  user: User
}

export default UserEmailSentDTO
