import { ApiProperty } from '@nestjs/swagger'
import { ILoginDTO } from '../interfaces'

/**
 * @file Auth Subdomain DTOs - LoginDTO
 * @module sneusers/subdomains/auth/dtos/LoginDTO
 */

/**
 * Successful login response body.
 *
 * @implements {ILoginDTO}
 */
class LoginDTO implements ILoginDTO {
  @ApiProperty({ description: 'User access token', type: String })
  readonly access_token: ILoginDTO['access_token']

  /**
   * Creates a new `LoginDTO`.
   *
   * @param {string} access_token - User access token
   */
  constructor(access_token: ILoginDTO['access_token']) {
    this.access_token = access_token
  }

  /**
   * Creates a JSON representation of the current dto.
   *
   * @return {Readonly<ILoginDTO>} JSON representation of dto
   */
  toJSON(): Readonly<ILoginDTO> {
    return Object.freeze({ access_token: this.access_token || '' })
  }
}

export default LoginDTO
