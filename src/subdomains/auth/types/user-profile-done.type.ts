import type { Strategy as OAuth2Strategy } from 'passport-oauth2'

/**
 * @file Auth Subdomain Type Definitions - UserProfileDone
 * @module sneusers/subdomains/auth/types/UserProfileDone
 */

/**
 * {@link OAuth2Strategy.userProfile} callback function.
 */
type UserProfileDone = Parameters<OAuth2Strategy['userProfile']>[1]

export default UserProfileDone
