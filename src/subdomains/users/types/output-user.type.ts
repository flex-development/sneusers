import type { WhoamiDTO } from '@sneusers/subdomains/auth/dtos'
import type { ILoginDTO } from '@sneusers/subdomains/auth/interfaces'
import type { OrPaginated } from '@sneusers/types'
import type { UserDTO } from '../dtos'

/**
 * @file Type Definitions - OutputUser
 * @module sneusers/subdomains/users/types/OutputUser
 */

/**
 * Response types produced by the `UserInterceptor`.
 */
type OutputUser = OrPaginated<UserDTO> | ILoginDTO | WhoamiDTO

export default OutputUser
