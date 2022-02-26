import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { NonNullFindOptions } from 'sequelize'
import type { EntityAttributes } from '../namespaces'

/**
 * @file DatabaseModule Type Definitions - SearchOptions
 * @module sneusers/modules/db/types/SearchOptions
 */

/**
 * Alias for {@link NonNullFindOptions}.
 *
 * @template T - Raw entity attributes
 */
type SearchOptions<T extends ObjectPlain = ObjectUnknown> = Partial<
  NonNullFindOptions<EntityAttributes.All<T>>
>

export default SearchOptions
