import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { Entity } from '../entities'

/**
 * @file DatabaseModule DTOs - EntityDTO
 * @module sneusers/modules/db/dtos/EntityDTO
 */

/**
 * JSON representation of an {@link Entity}.
 *
 * @template T - Entity attributes
 */
type EntityDTO<T extends ObjectPlain = ObjectUnknown> = Partial<T> & {
  id: Entity['id']
}

export default EntityDTO
