import type { Endpoints } from '@octokit/types'
import type { Profile as ProfileGoogle } from 'passport-google-oauth20'

/**
 * @file Auth Subdomain Namespaces - OAuthUserProfile
 * @module sneusers/subdomains/auth/namespaces/OAuthUserProfile
 */

/**
 * Profile data retrieved from OAuth profiles.
 */
namespace OAuthUserProfile {
  /**
   * GitHub user profile data.
   */
  export type GitHub = Endpoints['GET /user']['response']['data']

  /**
   * Google user profile data.
   */
  export type Google = ProfileGoogle['_json']
}

export default OAuthUserProfile
