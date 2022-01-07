import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { NonNullFindOptions } from 'sequelize'

/**
 * @file Type Definitions - AllSearchOptions
 * @module sneusers/types/AllSearchOptions
 */

/**
 * Alias for {@link NonNullFindOptions}.
 *
 * @template T - Entity attributes type
 */
type AllSearchOptions<T extends ObjectPlain = ObjectUnknown> = Partial<
  NonNullFindOptions<T>
>

export default AllSearchOptions
