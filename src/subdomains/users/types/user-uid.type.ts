import type { User } from '../entities'

/**
 * @file Users Subdomain Type Definitions - UserUid
 * @module sneusers/subdomains/users/types/UserUid
 */

/**
 * Unique {@link User} identifier.
 */
type UserUid = User['email'] | User['id']

export default UserUid
