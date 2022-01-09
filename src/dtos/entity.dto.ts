import type {
  ObjectPlain,
  ObjectUnknown,
  OneOrMany
} from '@flex-development/tutils'
import type { BaseEntity } from '@sneusers/entities'

/**
 * @file Data Transfer Objects - EntityDTO
 * @module sneusers/dtos/EntityDTO
 */

/**
 * Entity payload types.
 *
 * @template T - Entity attributes
 */
type EntityDTO<T extends ObjectPlain = ObjectUnknown> = OneOrMany<
  Partial<T> & { id: BaseEntity['id'] }
>

export default EntityDTO
