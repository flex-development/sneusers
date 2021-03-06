import type { OrNull } from '@flex-development/tutils'
import { OrUndefined } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Exception } from '@sneusers/exceptions'
import { EnvironmentVariables } from '@sneusers/models'
import { User } from '@sneusers/subdomains/users/entities'
import { Strategy } from 'passport-github2'
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
 * @file Authentication Strategies - GitHub
 * @module sneusers/subdomains/auth/strategies/GitHubStrategy
 */

@Injectable()
class GitHubStrategy
  extends OAuthStrategy(Strategy, AuthStrategy.GITHUB)
  implements AbstractStrategy
{
  constructor(
    protected readonly strategist: Strategist,
    protected readonly config: ConfigService<EnvironmentVariables, true>
  ) {
    super({
      authorizationURL: config.get<string>('GH_AUTHORIZATION_URL'),
      callbackURL: [
        config.get<string>('HOST'),
        OPENAPI.controller,
        OPENAPI.providerCallback.path.replace(':provider', AuthStrategy.GITHUB)
      ].join('/'),
      clientID: config.get<string>('GH_CLIENT_ID'),
      clientSecret: config.get<string>('GH_CLIENT_SECRET'),
      customHeaders: { Accept: 'application/json' },
      passReqToCallback: false,
      proxy: config.get<boolean>('SESSION_PROXY'),
      scope: config.get<OrUndefined<string>>('GH_SCOPES'),
      scopeSeparator: config.get<string>('GH_SCOPES_SEPARATOR'),
      skipUserProfile: false,
      state: true,
      tokenURL: config.get<string>('GH_TOKEN_URL'),
      userAgent: config.get<string>('HOSTNAME'),
      userEmailURL: config.get<string>('GH_USER_EMAIL_URL'),
      userProfileURL: config.get<string>('GH_USER_PROFILE_URL')
    } as unknown as StrategyOptions.GitHub)
  }

  /**
   * Retrieves a GitHub user profile.
   *
   * @param {string} access_token - GitHub user access token
   * @param {UserProfileDone} done - OAuth profile handler
   * @return {void} Nothing when complete
   */
  userProfile(access_token: string, done: UserProfileDone): void {
    return super.userProfile(
      access_token,
      (err?: OrNull<Error>, p?: OAuthProfile.GitHub) => done(err, p?._json)
    )
  }

  /**
   * Authenticates a user.
   *
   * Once authenticated, a `user` property will be added to the current request.
   *
   * @async
   * @param {string} access_token - GitHub user access token
   * @param {OrUndefined<string>} refresh_token - GitHub user refresh token
   * @param {OAuthUserProfile.GitHub} profile - GitHub user profile
   * @param {VerifyCallback} done - Passport verify callback
   * @return {Promise<void>} Empty promise when complete
   */
  async validate(
    access_token: string,
    refresh_token: OrUndefined<string>,
    profile: OAuthUserProfile.GitHub,
    done: VerifyCallback
  ): Promise<void> {
    let user: User

    try {
      user = await this.strategist.validateGitHub(
        access_token,
        refresh_token,
        profile
      )
    } catch (error) {
      return done(error as Exception, undefined, { profile })
    }

    return done(null, user!)
  }
}

export default GitHubStrategy
