import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { OrPaginated } from '@sneusers/types'
import type EntityDTO from './entity.dto'

/**
 * @file Data Transfer Objects - ResBodyEntity
 * @module sneusers/dtos/ResBodyEntity
 */

/**
 * Response body types that include entity data.
 *
 * @template T - Entity attributes
 */
type ResBodyEntity<T extends ObjectPlain = ObjectUnknown> = OrPaginated<
  EntityDTO<T>
>

export default ResBodyEntity
