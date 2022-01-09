import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { NonNullFindOptions } from 'sequelize'

/**
 * @file Type Definitions - SearchOptions
 * @module sneusers/types/SearchOptions
 */

/**
 * Alias for {@link NonNullFindOptions}.
 *
 * @template T - Entity attributes type
 */
type SearchOptions<T extends ObjectPlain = ObjectUnknown> = Partial<
  NonNullFindOptions<T>
>

export default SearchOptions
