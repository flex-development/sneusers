import type { ObjectPlain } from '@flex-development/tutils'
import type { ResBodyEntity } from '@sneusers/dtos'
import type { BaseEntity } from '@sneusers/entities'

/**
 * @file Type Definitions - OutputEntity
 * @module sneusers/types/OutputEntity
 */

/**
 * Response types produced by the `EntitySerializer`.
 *
 * @template E - Entity class type
 */
type OutputEntity<E extends BaseEntity> =
  | ResBodyEntity<E['_attributes']>
  | ObjectPlain

export default OutputEntity
