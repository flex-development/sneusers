/**
 * @file Handlers - DeleteAccountHandler
 * @module sneusers/accounts/handlers/DeleteAccount
 */

import DeleteAccountCommand from '#accounts/commands/delete-account.command'
import Account from '#accounts/entities/account.entity'
import AccountDeletedEvent from '#accounts/events/account-deleted.event'
import AccountsRepository from '#accounts/providers/accounts.repository'
import {
  CommandHandler,
  EventBus,
  type ICommandHandler
} from '@nestjs/cqrs'
import { ok } from 'devlop'

/**
 * Account deletion handler.
 *
 * @class
 * @implements {ICommandHandler<DeleteAccountCommand>}
 */
@CommandHandler(DeleteAccountCommand)
class DeleteAccountHandler implements ICommandHandler<DeleteAccountCommand> {
  /**
   * Create a new account deletion handler.
   *
   * @param {AccountsRepository} accounts
   *  User accounts repository
   * @param {EventBus} events
   *  Event bus
   */
  constructor(
    protected accounts: AccountsRepository,
    protected events: EventBus
  ) {}

  /**
   * Delete a user account.
   *
   * > 👉 **Note**: The account referenced by {@linkcode command.uid} is
   * > expected to exist. The `ExistingAccountGuard` should be used before
   * > attempting to execute `command`.
   *
   * @public
   * @instance
   * @async
   *
   * @param {DeleteAccountCommand} command
   *  The command to execute
   * @return {Promise<Account>}
   *  The deleted user account
   */
  public async execute(command: DeleteAccountCommand): Promise<Account> {
    ok(typeof command.uid === 'string', 'expected account id to be a string')
    ok(command.uid, 'expected account id to be non-empty string')

    /**
     * The deleted user account.
     *
     * @const {Account} account
     */
    const account: Account = await this.accounts.delete(command.uid)

    // publish domain event.
    this.events.publish(new AccountDeletedEvent(account))

    return account
  }
}

export default DeleteAccountHandler
