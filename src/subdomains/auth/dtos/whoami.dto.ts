import { PartialType } from '@nestjs/swagger'
import { UserDTO } from '@sneusers/subdomains/users/dtos'

/**
 * @file Auth Subdomain DTOs - WhoamiDTO
 * @module sneusers/subdomains/auth/dtos/WhoamiDTO
 */

/**
 * User identification request response.
 *
 * @extends {Partial<UserDTO>}
 */
class WhoamiDTO extends PartialType(UserDTO) {}

export default WhoamiDTO
