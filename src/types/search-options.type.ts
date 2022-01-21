import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { NonNullFindOptions } from 'sequelize'
import type ModelAttributes from './model-attributes.type'

/**
 * @file Type Definitions - SearchOptions
 * @module sneusers/types/SearchOptions
 */

/**
 * Alias for {@link NonNullFindOptions}.
 *
 * @template T - Raw entity attributes
 */
type SearchOptions<T extends ObjectPlain = ObjectUnknown> = Partial<
  NonNullFindOptions<ModelAttributes.All<T>>
>

export default SearchOptions
