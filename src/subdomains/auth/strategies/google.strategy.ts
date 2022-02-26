import type { OrNull } from '@flex-development/tutils'
import { OrUndefined } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Exception } from '@sneusers/exceptions'
import { EnvironmentVariables } from '@sneusers/models'
import { User } from '@sneusers/subdomains/users/entities'
import { GoogleCallbackParameters, Strategy } from 'passport-google-oauth20'
import { VerifyCallback } from 'passport-oauth2'
import { AbstractStrategy } from '../abstracts'
import OPENAPI from '../controllers/openapi/oauth.openapi'
import { AuthStrategy } from '../enums'
import type { StrategyOptions } from '../namespaces'
import { OAuthProfile, OAuthUserProfile } from '../namespaces'
import { Strategist } from '../providers'
import { UserProfileDone } from '../types'
import OAuthStrategy from './oauth.strategy'

/**
 * @file Authentication Strategies - Google
 * @module sneusers/subdomains/auth/strategies/GoogleStrategy
 */

@Injectable()
class GoogleStrategy
  extends OAuthStrategy(Strategy, AuthStrategy.GOOGLE)
  implements AbstractStrategy
{
  constructor(
    protected readonly strategist: Strategist,
    protected readonly config: ConfigService<EnvironmentVariables, true>
  ) {
    super({
      authorizationURL: config.get<string>('GOOGLE_AUTHORIZATION_URL'),
      callbackURL: [
        config.get<string>('HOST'),
        OPENAPI.controller,
        OPENAPI.providerCallback.path.replace(':provider', AuthStrategy.GOOGLE)
      ].join('/'),
      clientID: config.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET'),
      passReqToCallback: false,
      proxy: config.get<boolean>('SESSION_PROXY'),
      scope: config.get<OrUndefined<string>>('GOOGLE_SCOPES'),
      scopeSeparator: config.get<string>('GOOGLE_SCOPES_SEPARATOR'),
      skipUserProfile: false,
      state: true,
      tokenURL: config.get<string>('GOOGLE_TOKEN_URL'),
      userAgent: config.get<string>('HOSTNAME'),
      userProfileURL: config.get<string>('GOOGLE_USER_PROFILE_URL')
    } as unknown as StrategyOptions.Google)
  }

  /**
   * Retrieves a Google user profile.
   *
   * @param {string} access_token - Google user access token
   * @param {UserProfileDone} done - OAuth profile handler
   * @return {void} Nothing when complete
   */
  userProfile(access_token: string, done: UserProfileDone): void {
    return super.userProfile(
      access_token,
      (err?: OrNull<Error>, p?: OAuthProfile.Google) => done(err, p?._json)
    )
  }

  /**
   * Authenticates a user.
   *
   * Once authenticated, a `user` property will be added to the current request.
   *
   * @async
   * @param {string} access_token - Google user access token
   * @param {OrUndefined<string>} refresh_token - Google user refresh token
   * @param {GoogleCallbackParameters} params - Google callback parameters
   * @param {OAuthUserProfile.Google} profile - Google user profile
   * @param {VerifyCallback} done - Passport verify callback
   * @return {Promise<void>} Empty promise when complete
   */
  async validate(
    access_token: string,
    refresh_token: OrUndefined<string>,
    params: GoogleCallbackParameters,
    profile: OAuthUserProfile.Google,
    done: VerifyCallback
  ): Promise<void> {
    let user: User

    try {
      user = await this.strategist.validateGoogle(
        access_token,
        refresh_token,
        params,
        profile
      )
    } catch (error) {
      return done(error as Exception, undefined, { params, profile })
    }

    return done(null, user!)
  }
}

export default GoogleStrategy
