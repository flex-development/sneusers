import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { PaginatedDTO } from '@sneusers/dtos'

/**
 * @file Type Definitions - OrPaginated
 * @module sneusers/types/OrPaginated
 */

/**
 * Represents a single piece of data in a response, or a paginated response.
 *
 * @template T - Response data type
 */
type OrPaginated<T extends ObjectPlain = ObjectUnknown> = T | PaginatedDTO<T>

export default OrPaginated
