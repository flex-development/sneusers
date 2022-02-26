import type { ObjectPlain } from '@flex-development/tutils'
import type { OrPaginated } from '@sneusers/types'
import type { Entity } from '../entities'

/**
 * @file DatabaseModule Type Definitions - StreamEntity
 * @module sneusers/modules/db/types/StreamEntity
 */

/**
 * Pre-intercepted response types accepted by the `EntitySerializer`.
 *
 * @template E - Entity class type
 */
type StreamEntity<E extends Entity> = OrPaginated<E> | ObjectPlain

export default StreamEntity
