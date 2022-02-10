import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { BaseEntity } from '@sneusers/entities'
import type { Model } from 'sequelize'

/**
 * @file Type Definitions - ModelAttributes
 * @module sneusers/types/ModelAttributes
 */

/**
 * Utility namespace for picking entity attributes.
 *
 * @template T - Entity object class or miscellaneous object
 */
namespace ModelAttributes {
  /**
   * Picks **all** entity attributes. Includes [virtual fields][1].
   *
   * [1]: https://sequelize.org/v7/manual/getters-setters-virtuals#virtual-fields
   *
   * @template T - Entity object class or miscellaneous object
   */
  export type All<T extends ObjectPlain = ObjectUnknown> = T extends BaseEntity
    ? T['_attributes'] & T['_virtualAttributes']
    : T extends Model
    ? T['_attributes']
    : T

  /**
   * Picks **only** [virtual fields][1].
   *
   * [1]: https://sequelize.org/v7/manual/getters-setters-virtuals#virtual-fields
   *
   * @template TModelAttributes - Raw entity attributes
   * @template VirtualFields - [Virtual fields][1] (with or without attributes)
   */
  export type Virtual<
    T extends ObjectPlain = ObjectUnknown,
    F extends ObjectPlain = never
  > = Omit<F, keyof T>
}

export default ModelAttributes
