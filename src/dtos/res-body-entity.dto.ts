import type {
  ObjectPlain,
  ObjectUnknown,
  OneOrMany
} from '@flex-development/tutils'
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
type ResBodyEntity<T extends ObjectPlain = ObjectUnknown> = OneOrMany<
  EntityDTO<T>
>

export default ResBodyEntity
