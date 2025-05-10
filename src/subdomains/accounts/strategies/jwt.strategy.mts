/**
 * @file Strategies - JwtStrategy
 * @module sneusers/accounts/strategies/Jwt
 */

import AccessDeniedException from '#accounts/errors/access-denied.exception'
import JwtOptionsFactory from '#accounts/factories/jwt-options.factory'
import GetAccountQuery from '#accounts/queries/get-account.query'
import type { Account, TokenPayload } from '@flex-development/sneusers/accounts'
import { Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PassportStrategy } from '@nestjs/passport'
import { ok } from 'devlop'
import type { FastifyRequest } from 'fastify'
import { ExtractJwt, Strategy } from 'passport-jwt'

/**
 * JWT authentication strategy.
 *
 * @class
 */
@Injectable()
class JwtStrategy extends PassportStrategy<typeof Strategy, Account>(Strategy) {
  /**
   * Create a new JWT authentication strategy.
   *
   * @param {QueryBus} queries
   *  The query bus
   * @param {JwtOptionsFactory} options
   *  JWT options factory
   */
  constructor(protected queries: QueryBus, options: JwtOptionsFactory) {
    const { secret, signOptions } = options.createJwtOptions()

    ok(typeof secret === 'string', 'expected `secret` to be a string')
    ok(signOptions, 'expected jwt signing options')

    super({
      audience: signOptions.audience,
      ignoreExpiration: false,
      issuer: signOptions.issuer,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: secret
    })
  }

  /**
   * Get the user account associated with `payload`.
   *
   * @public
   * @instance
   * @async
   *
   * @param {Pick<FastifyRequest, 'params'>} request
   *  The incoming request object
   * @param {Pick<TokenPayload, 'sub'>} payload
   *  Token payload
   * @return {Account}
   *  The account of the authenticated user
   * @throws {AccessDeniedException}
   *  If `request.params.uid` and `payload.sub` do not match
   */
  public async validate(
    request: Pick<FastifyRequest, 'params'>,
    payload: Pick<TokenPayload, 'sub'>
  ): Promise<Account> {
    const { sub } = payload
    const { uid = sub } = request.params

    ok(typeof sub === 'string', 'expected `payload.sub` to be a string')
    ok(sub, 'expected `payload.sub` to be a non-empty string')

    // make sure token payload is for the current account.
    if (sub !== uid) throw new AccessDeniedException()

    return this.queries.execute(new GetAccountQuery(sub))
  }
}

export default JwtStrategy
