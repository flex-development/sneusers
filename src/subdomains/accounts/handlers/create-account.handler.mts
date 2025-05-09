/**
 * @file Handlers - CreateAccountHandler
 * @module sneusers/accounts/handlers/CreateAccount
 */

import CreateAccountCommand from '#accounts/commands/create-account.command'
import Account from '#accounts/entities/account.entity'
import AccountsRepository from '#accounts/providers/accounts.repository'
import {
  EmailConflictException
} from '@flex-development/sneusers/accounts/errors'
import { InjectMapper, Mapper } from '@flex-development/sneusers/database'
import {
  CommandHandler,
  EventPublisher,
  type ICommandHandler
} from '@nestjs/cqrs'
import bcrypt from 'bcrypt'

/**
 * User account creation handler.
 *
 * @class
 * @implements {ICommandHandler<CreateAccountCommand>}
 */
@CommandHandler(CreateAccountCommand)
class CreateAccountHandler implements ICommandHandler<CreateAccountCommand> {
  /**
   * Create a new user account creation handler.
   *
   * @param {AccountsRepository} accounts
   *  User accounts repository
   * @param {Mapper<Account>} mapper
   *  User account data mapper
   * @param {EventPublisher} publisher
   *  Event publisher
   */
  constructor(
    protected accounts: AccountsRepository,
    @InjectMapper(Account) protected mapper: Mapper<Account>,
    protected publisher: EventPublisher
  ) {}

  /**
   * Create a new user account.
   *
   * @public
   * @instance
   * @async
   *
   * @param {CreateAccountCommand} command
   *  The command to execute
   * @return {Promise<Account>}
   *  The new user account
   * @throws {EmailConflictException}
   *  If user account with email `command.email` already exists
   */
  public async execute(command: CreateAccountCommand): Promise<Account> {
    if (await this.accounts.findByEmail(command.email)) {
      throw new EmailConflictException(command.email)
    }

    /**
     * New user account.
     *
     * @const {Account} account
     */
    const account: Account = this.mapper.toDomain({
      created_at: Date.now(),
      email: command.email,
      password: command.password,
      role: command.type,
      updated_at: null
    })

    // validate acccount.
    account.validate()

    // hash password.
    account.password = this.hash(account.password)

    // add account to database.
    await this.accounts.insert(account)

    // publish domain event.
    this.publisher.mergeObjectContext(account)
    account.commit()

    return account
  }

  /**
   * Hash a `password`.
   *
   * @protected
   * @instance
   *
   * @param {string} password
   *  The password to hash
   * @return {string}
   *  Hashed password
   */
  protected hash(password: string): string

  /**
   * Hash a `password`.
   *
   * @protected
   * @instance
   *
   * @param {string | null} password
   *  The password to hash
   * @return {string | null}
   *  Hashed password, or `null` if password is `null`
   */
  protected hash(password: string | null): string | null {
    if (typeof password === 'string') password = bcrypt.hashSync(password, 10)
    return password
  }
}

export default CreateAccountHandler
