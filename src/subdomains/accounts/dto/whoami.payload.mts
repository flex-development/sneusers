/**
 * @file Data Transfer Objects - WhoamiPayload
 * @module sneusers/accounts/dto/WhoamiPayload
 */

import type { Account } from '@flex-development/sneusers/accounts'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'

/**
 * Authentication check response.
 *
 * @class
 */
@ApiSchema()
class WhoamiPayload {
  /**
   * Unique account id.
   *
   * @public
   * @instance
   * @member {string | null} uid
   */
  @ApiProperty({
    description: 'unique account id',
    oneOf: [{ type: 'string' }, { type: 'null' }]
  })
  public uid: string | null

  /**
   * Create a new authentication check payload.
   *
   * @param {Account | null | undefined} [account]
   *  The account of the authenticated user
   */
  constructor(account?: Account | null | undefined) {
    this.uid = account?.uid ?? null
  }
}

export default WhoamiPayload
