/**
 * @file Commands - DeleteAccountCommand
 * @module sneusers/accounts/commands/DeleteAccount
 */

import type { Account } from '@flex-development/sneusers/accounts'
import { Command } from '@nestjs/cqrs'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'

/**
 * Account deletion command.
 *
 * @class
 * @extends {Command<Account>}
 */
@ApiSchema()
class DeleteAccountCommand extends Command<Account> {
  /**
   * The id of the account to delete.
   *
   * @public
   * @instance
   * @member {string} uid
   */
  @ApiProperty({ description: 'id of account to delete', type: 'string' })
  public uid!: string
}

export default DeleteAccountCommand
