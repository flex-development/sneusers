import { Type } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { Strategy as OAuth2Strategy } from 'passport-oauth2'
import { AbstractStrategy } from '../abstracts'
import { AuthenticateOptions } from '../namespaces'

/**
 * @file Authentication Strategies - OAuth
 * @module sneusers/subdomains/auth/strategies/OAuthStrategy
 */

/**
 * Creates an abstract OAuth strategy.
 *
 * @template T - `OAuth2Strategy` class type
 *
 * @param {T} Strategy - Authentication strategy class
 * @param {string} [name] - Strategy name
 * @return {ReturnType<typeof PassportStrategy>} New {@link OAuthStrategy} class
 */
function OAuthStrategy<T extends Type<OAuth2Strategy> = Type<OAuth2Strategy>>(
  Strategy: T,
  name?: string
): { new (...args: any[]): InstanceType<T> } {
  /**
   * Base OAuth strategy.
   *
   * @abstract
   * @extends PassportStrategy
   * @implements {AbstractStrategy}
   */
  abstract class OAuthStrategy
    // @ts-expect-error Base constructor return type 'InstanceType<T>' is not an
    // object type or intersection of object types with statically known members
    extends PassportStrategy(Strategy, name)
    implements AbstractStrategy
  {
    constructor(...args: any[]) {
      super(...args)

      /**
       * This override is required to pass the `params` argument to `validate`.
       *
       * Unfortunately, the underlying `OAuth2Strategy` relies on method arity,
       * rather than a strategy option, to determine when the argument should be
       * passed. Due to how `NestPassportStrategy` is implemented, arity isn't
       * reliable.
       *
       * With this override, however, users will need to call `done` themselves.
       *
       * @see https://github.com/jaredhanson/passport-google-oauth2/issues/28#issuecomment-567747375
       */
      Object.assign(this, { _verify: this.validate })
    }

    /**
     * @public
     * @abstract
     * @readonly
     * @property {string} name - Strategy name
     */
    abstract readonly name?: string

    /**
     * Authenticates requests.
     *
     * Applies the {@link name} strategy (or strategies) to the incoming request
     * in order to authenticate `req`.
     *
     * [1]: https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js
     *
     * @abstract
     * @param {Request} req - Incoming request
     * @param {AuthenticateOptions.Base} options - [`authenticate`][1] options
     * @return {any}
     */
    abstract authenticate(req: Request, options?: AuthenticateOptions.Base): any

    /**
     * Authenticates a user.
     *
     * Once authenticated, a `user` property will be added to the current
     * request.
     *
     * @abstract
     * @param {any[]} args - Function arguments
     * @return {any}
     */
    abstract validate(...args: any[]): any
  }

  // @ts-expect-error Cannot assign an abstract constructor type to a
  // non-abstract constructor type
  return OAuthStrategy
}

export default OAuthStrategy
