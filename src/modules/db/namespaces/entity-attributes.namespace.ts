import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { Model } from 'sequelize'
import type { Entity } from '../entities'

/**
 * @file DatabaseModule Namespaces - EntityAttributes
 * @module sneusers/modules/db/namespaces/EntityAttributes
 */

/**
 * Utility namespace for picking entity attributes.
 *
 * @template T - Entity object class or miscellaneous object
 */
namespace EntityAttributes {
  /**
   * Picks **all** entity attributes. Includes [virtual fields][1].
   *
   * [1]: https://sequelize.org/v7/manual/getters-setters-virtuals#virtual-fields
   *
   * @template T - Entity object class or miscellaneous object
   */
  export type All<T extends ObjectPlain = ObjectUnknown> = T extends Entity
    ? T['_attributes'] & T['_virtualAttributes']
    : T extends Model
    ? T['_attributes']
    : T

  /**
   * Picks **only** [virtual fields][1].
   *
   * [1]: https://sequelize.org/v7/manual/getters-setters-virtuals#virtual-fields
   *
   * @template TEntityAttributes - Raw entity attributes
   * @template VirtualFields - [Virtual fields][1] (with or without attributes)
   */
  export type Virtual<
    T extends ObjectPlain = ObjectUnknown,
    F extends ObjectPlain = never
  > = Omit<F, keyof T>
}

export default EntityAttributes
