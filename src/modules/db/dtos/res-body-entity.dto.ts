import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { OrPaginated } from '@sneusers/types'
import type EntityDTO from './entity.dto'

/**
 * @file DatabaseModule DTOs - ResBodyEntity
 * @module sneusers/modules/db/dtos/ResBodyEntity
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
