import type User from '@sneusers/subdomains/users/entities/user.dao'

/**
 * @file Type Definitions - UserUid
 * @module sneusers/subdomains/users/types/UserUid
 */

/**
 * Unique {@link User} identifier.
 */
type UserUid = User['email'] | User['id']

export default UserUid
