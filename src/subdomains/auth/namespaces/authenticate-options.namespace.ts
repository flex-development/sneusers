import type { IAuthModuleOptions } from '@nestjs/passport'
import type { AuthenticateOptions as AuthenticateOptionsBase } from 'passport'
import type { AuthenticateOptionsGoogle } from 'passport-google-oauth20'

/**
 * @file Auth Subdomain Namespaces - AuthenticateOptions
 * @module sneusers/subdomains/auth/namespaces/AuthenticateOptions
 */

/**
 * [`passport.authenticate`][1] options.
 *
 * [1]: https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js
 */
namespace AuthenticateOptions {
  /**
   * Base `passport.authenticate` options.
   */
  export type Base = IAuthModuleOptions & AuthenticateOptionsBase

  /**
   * `passport.authenticate(AuthStrategy.GITHUB)` options.
   *
   * @see https://docs.github.com/developers/apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
   */
  export type GitHub = Base & {
    /**
     * Whether or not unauthenticated users will be offered an option to sign up
     * for GitHub during the OAuth flow.
     *
     * @default 'true'
     */
    allow_signup?: 'false' | 'true'

    /**
     * Suggest a specific account to use.
     */
    login?: string
  }

  /**
   * `passport.authenticate(AuthStrategy.GOOGLE)` options.
   *
   * @see https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient
   */
  export type Google = AuthenticateOptionsGoogle

  /**
   * `passport.authenticate(OAuthProvider)` options.
   */
  export type OAuth = Base & GitHub & Google
}

export default AuthenticateOptions
