import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type EntityDTO from './entity.dto'
import type PaginatedDTO from './paginated.dto'

/**
 * @file Data Transfer Objects - ResBodyEntity
 * @module sneusers/dtos/ResBodyEntity
 */

/**
 * Response body types that include entity data.
 *
 * @template T - Entity attributes
 */
type ResBodyEntity<T extends ObjectPlain = ObjectUnknown> =
  | EntityDTO<T>
  | PaginatedDTO<EntityDTO<T>>

export default ResBodyEntity
