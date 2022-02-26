import type PassportGitHub from 'passport-github2'
import type PassportGoogle from 'passport-google-oauth20'
import type PassportOAuth2 from 'passport-oauth2'

/**
 * @file Auth Subdomain Namespaces - StrategyOptions
 * @module sneusers/subdomains/auth/namespaces/StrategyOptions
 */

/**
 * Authentication strategy options.
 */
namespace StrategyOptions {
  /**
   * GitHub strategy options.
   */
  export type GitHub = PassportOAuth2.StrategyOptions &
    PassportGitHub.StrategyOptions

  /**
   * Google strategy options.
   */
  export type Google = PassportOAuth2.StrategyOptions &
    PassportGoogle.StrategyOptions
}

export default StrategyOptions
