/**
 * @file Commands - CreateAccountCommand
 * @module sneusers/accounts/commands/CreateAccount
 */

import Role from '#accounts/enums/role'
import type { Account } from '@flex-development/sneusers/accounts'
import { Command } from '@nestjs/cqrs'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'

/**
 * Account creation command.
 *
 * @class
 * @extends {Command<Account>}
 */
@ApiSchema()
class CreateAccountCommand extends Command<Account> {
  /**
   * Email address of new user.
   *
   * @public
   * @instance
   * @member {string} email
   */
  @ApiProperty({
    description: 'email address of new user',
    format: 'email',
    type: 'string'
  })
  public email!: string

  /**
   * Account password.
   *
   * @public
   * @instance
   * @member {string} password
   */
  @ApiProperty({
    description: 'password for account',
    format: 'password',
    minLength: 6,
    type: 'string'
  })
  public password!: string

  /**
   * The type of account to create.
   *
   * @public
   * @instance
   * @member {Role} type
   */
  @ApiProperty({ description: 'type of account to create', enum: Role })
  public type!: Role
}

export default CreateAccountCommand
