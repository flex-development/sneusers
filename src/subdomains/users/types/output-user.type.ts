import { WhoamiDTO } from '@sneusers/subdomains/auth/dtos'
import type { ILoginDTO } from '@sneusers/subdomains/auth/interfaces'
import type { UserDTO } from '@sneusers/subdomains/users/dtos'
import type { OrPaginated } from '@sneusers/types'

/**
 * @file Type Definitions - OutputUser
 * @module sneusers/subdomains/users/types/OutputUser
 */

/**
 * Response types produced by the `UserInterceptor`.
 */
type OutputUser = OrPaginated<UserDTO> | ILoginDTO | WhoamiDTO

export default OutputUser
