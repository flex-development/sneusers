import { Profile } from 'passport-github2'
import { AuthProvider } from '../enums'
import type { GitHubProfile } from '../types'

/**
 * @file Auth Subdomain Interfaces - GitHubOAuthProfile
 * @module sneusers/subdomains/users/interfaces/GitHubOAuthProfile
 */

/**
 * GitHub OAuth profile data.
 *
 * @extends Profile
 */
interface GitHubOAuthProfile extends Profile {
  _json: GitHubProfile
  _raw: string
  provider: AuthProvider.GITHUB
}

export default GitHubOAuthProfile
