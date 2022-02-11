import type { ILoginDTO } from '@sneusers/subdomains/auth/interfaces'
import type { OrPaginated } from '@sneusers/types'
import type { IUser } from '../interfaces'

/**
 * @file Type Definitions - StreamUser
 * @module sneusers/subdomains/users/types/StreamUser
 */

/**
 * Pre-intercepted response types accepted by the `UserInterceptor`.
 */
type StreamUser = OrPaginated<Partial<IUser>> | ILoginDTO

export default StreamUser
