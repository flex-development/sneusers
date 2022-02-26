import type { Profile as ProfileGitHub } from 'passport-github2'
import type { Profile as ProfileGoogle } from 'passport-google-oauth20'
import { OAuthProvider } from '../enums'
import OAuthUserProfile from './oauth-user-profile.namespace'

/**
 * @file Auth Subdomain Namespaces - OAuthProfile
 * @module sneusers/subdomains/auth/namespaces/OAuthProfile
 */

/**
 * OAuth profiles.
 */
namespace OAuthProfile {
  /**
   * GitHub OAuth profile data.
   *
   * @extends ProfileGitHub
   */
  export interface GitHub extends ProfileGitHub {
    _json: OAuthUserProfile.GitHub
    _raw: string
    provider: OAuthProvider.GITHUB
  }

  /**
   * Google OAuth profile data.
   *
   * @extends ProfileGoogle
   */
  export interface Google extends ProfileGoogle {
    _json: OAuthUserProfile.Google
    provider: OAuthProvider.GOOGLE
  }
}

export default OAuthProfile
