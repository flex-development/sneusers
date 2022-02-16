import type { Endpoints } from '@octokit/types'

/**
 * @file Auth Subdomain Type Definitions - GitHubProfile
 * @module sneusers/subdomains/auth/types/GitHubProfile
 */

/**
 * GitHub user profile data.
 */
type GitHubProfile = Endpoints['GET /user']['response']['data']

export default GitHubProfile
