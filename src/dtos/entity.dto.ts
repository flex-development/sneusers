import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { BaseEntity } from '@sneusers/entities'

/**
 * @file Data Transfer Objects - EntityDTO
 * @module sneusers/dtos/EntityDTO
 */

/**
 * JSON representation of an entity.
 *
 * @see {@link BaseEntity}
 *
 * @template T - Entity attributes
 */
type EntityDTO<T extends ObjectPlain = ObjectUnknown> = Partial<T> & {
  id: BaseEntity['id']
}

export default EntityDTO
