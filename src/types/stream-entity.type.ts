import type { ObjectPlain } from '@flex-development/tutils'
import type { BaseEntity } from '@sneusers/entities'
import type { OrPaginated } from '@sneusers/types'

/**
 * @file Type Definitions - StreamEntity
 * @module sneusers/types/StreamEntity
 */

/**
 * Pre-intercepted response types accepted by the `EntitySerializer`.
 *
 * @template E - Entity class type
 */
type StreamEntity<E extends BaseEntity> = OrPaginated<E> | ObjectPlain

export default StreamEntity
