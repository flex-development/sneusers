import { ObjectPlain, OrNull, OrUndefined } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport'
import { EnvironmentVariables } from '@sneusers/models'
import { ScryptService } from '@sneusers/modules/crypto/providers'
import { User } from '@sneusers/subdomains/users/entities'
import type { StrategyOptions as GitHubStrategyOptions } from 'passport-github2'
import { Strategy } from 'passport-github2'
import type { StrategyOptions as OAuthStrategyOptions } from 'passport-oauth2'
import OPENAPI from '../controllers/openapi/oauth.openapi'
import { AuthStrategy } from '../enums'
import type { GitHubOAuthProfile } from '../interfaces'
import { Strategist } from '../providers'
import { GitHubProfile, UserProfileDone } from '../types'

/**
 * @file Authentication Strategies - GitHub
 * @module sneusers/subdomains/auth/strategies/GitHubStrategy
 */

@Injectable()
class GitHubStrategy
  extends PassportStrategy(Strategy, AuthStrategy.GITHUB)
  implements AbstractStrategy
{
  constructor(
    protected readonly strategist: Strategist,
    protected readonly config: ConfigService<EnvironmentVariables, true>,
    protected readonly scrypt: ScryptService
  ) {
    super({
      authorizationURL: config.get<string>('GH_AUTHORIZATION_URL'),
      callbackURL: [
        config.get<string>('HOST'),
        OPENAPI.controller,
        OPENAPI.githubCallback.path
      ].join('/'),
      clientID: config.get<string>('GH_CLIENT_ID'),
      clientSecret: config.get<string>('GH_CLIENT_SECRET'),
      customHeaders: { Accept: 'application/json' },
      passReqToCallback: false,
      proxy: config.get<boolean>('SESSION_PROXY'),
      scope: config.get<string>('GH_SCOPES'),
      scopeSeparator: config.get<string>('GH_SCOPES_SEPARATOR'),
      skipUserProfile: false,
      state: true,
      tokenURL: config.get<string>('GH_TOKEN_URL'),
      userAgent: config.get<string>('HOSTNAME'),
      userEmailURL: config.get<string>('GH_USER_EMAIL_URL'),
      userProfileURL: config.get<string>('GH_USER_PROFILE_URL')
    } as unknown as OAuthStrategyOptions & GitHubStrategyOptions)
  }

  /**
   * Returns extra parameters to be included in the authorization request.
   *
   * @return {ObjectPlain} Authorization parameters
   */
  authorizationParams(): ObjectPlain {
    return {
      allow_signup: 'false'
    }
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
      (err?: OrNull<Error>, p?: GitHubOAuthProfile) => done(err, p?._json)
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
   * @param {GitHubProfile} profile - GitHub user profile
   * @return {Promise<User>} Promise containing authenticated user
   */
  async validate(
    access_token: string,
    refresh_token: OrUndefined<string>,
    profile: GitHubProfile
  ): Promise<User> {
    return this.strategist.validateGitHub(access_token, refresh_token, profile)
  }
}

export default GitHubStrategy
