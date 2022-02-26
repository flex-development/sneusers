import type { ObjectPlain } from '@flex-development/tutils'
import type { ResBodyEntity } from '../dtos'
import type { Entity } from '../entities'

/**
 * @file DatabaseModule Type Definitions - OutputEntity
 * @module sneusers/modules/db/types/OutputEntity
 */

/**
 * Response types produced by the `EntitySerializer`.
 *
 * @template E - Entity class type
 */
type OutputEntity<E extends Entity> =
  | ResBodyEntity<E['_attributes']>
  | ObjectPlain

export default OutputEntity
