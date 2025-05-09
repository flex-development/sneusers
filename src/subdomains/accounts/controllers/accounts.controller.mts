/**
 * @file Controllers - AccountsController
 * @module sneusers/accounts/controllers/AccountsController
 */

import CreateAccountCommand from '#accounts/commands/create-account.command'
import User from '#accounts/decorators/user.decorator'
import AccountCreatedPayload from '#accounts/dto/account-created.payload'
import WhoamiPayload from '#accounts/dto/whoami.payload'
import WhoamiGuard from '#accounts/guards/whoami.guard'
import AuthService from '#accounts/services/auth.service'
import routes from '#enums/routes'
import subroutes from '#enums/subroutes'
import ExceptionFilter from '#filters/exception.filter'
import UnhandledExceptionFilter from '#filters/unhandled.filter'
import TransformPipe from '#pipes/transform.pipe'
import type { Account } from '@flex-development/sneusers/accounts'
import {
  EmailConflictException
} from '@flex-development/sneusers/accounts/errors'
import {
  InternalServerException,
  ValidationException
} from '@flex-development/sneusers/errors'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseFilters,
  UseGuards,
  UsePipes
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { ok } from 'devlop'
import type { FastifyReply } from 'fastify'

/**
 * User accounts controller.
 *
 * @class
 */
@Controller(routes.ACCOUNTS)
@ApiTags(routes.ACCOUNTS.slice(1))
@UsePipes(TransformPipe)
@UseFilters(ExceptionFilter)
@UseFilters(UnhandledExceptionFilter)
@ApiInternalServerErrorResponse({ type: InternalServerException })
class AccountsController {
  /**
   * Create a new user accounts controller.
   *
   * @param {CommandBus} commands
   *  The command bus
   * @param {AuthService} auth
   *  Authentication and authorization service
   */
  constructor(protected commands: CommandBus, protected auth: AuthService) {}

  /**
   * Create a new account using email and password.
   *
   * @public
   * @instance
   * @async
   *
   * @param {CreateAccountCommand} body
   *  The request body containing the data to create a new account
   * @return {Promise<AccountCreatedPayload>}
   *  New account payload
   */
  @Post(subroutes.ACCOUNTS_CREATE)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: AccountCreatedPayload })
  @ApiConflictResponse({ type: EmailConflictException })
  @ApiBadRequestResponse({ type: ValidationException })
  public async create(
    @Body() body: CreateAccountCommand
  ): Promise<AccountCreatedPayload> {
    ok(body instanceof CreateAccountCommand, 'expected a command')

    /**
     * The new account.
     *
     * @const {Account} account
     */
    const account: Account = await this.commands.execute(body)

    return new AccountCreatedPayload(
      account,
      await this.auth.accessToken(account),
      await this.auth.refreshToken(account)
    )
  }

  /**
   * Check authentication.
   *
   * @public
   * @instance
   *
   * @param {Account | null | undefined} account
   *  The account of the currently authenticated user
   * @param {FastifyReply} res
   *  The server response object
   * @return {undefined}
   *  Nothing; sends authentication check payload
   */
  @Get(subroutes.ACCOUNTS_WHOAMI)
  @UseGuards(WhoamiGuard)
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    examples: { bearer: { value: 'bearer <token>' } },
    name: 'authorization',
    required: false
  })
  @ApiOkResponse({ type: WhoamiPayload })
  @ApiUnauthorizedResponse({ type: WhoamiPayload })
  public whoami(
    @User() account: Account | null | undefined,
    @Res() res: FastifyReply
  ): undefined {
    res.status(account ? HttpStatus.OK : HttpStatus.UNAUTHORIZED)
    return void res.send(new WhoamiPayload(account))
  }
}

export default AccountsController
