import type {
  NumberString,
  ObjectPlain,
  ObjectUnknown,
  OneOrMany,
  Path
} from '@flex-development/tutils'
import type OrderDirection from '@sneusers/enums/order-direction.enum'
import type {
  LOCK,
  WhereAttributeHash,
  WhereOptions,
  WhereValue
} from 'sequelize'
import type { Model, ModelStatic } from 'sequelize-typescript'
import type { Col, Fn } from 'sequelize/dist/lib/utils'
import type AllSearchOptions from './all-search-options.type'

/**
 * @file Type Definitions - SearchOption
 * @module sneusers/types/SearchOption
 */

/**
 * Sequelize query options that can be passed via URL search parameters.
 *
 * **NOTE**: Some option types may be modified to support URL queries.
 *
 * @see {@link AllSearchOptions}
 *
 * @see https://sequelize.org/v7/manual/model-querying-basics
 * @see https://sequelize.org/v7/manual/model-querying-finders
 */
namespace SearchOption {
  /**
   * List of the attributes to select.
   *
   * @template T - Entity attributes type
   */
  export type Attributes<T extends ObjectPlain = ObjectUnknown> = Path<T>[]

  /**
   * [`GROUP BY`][1] in sql.
   *
   * [1]: https://www.w3schools.com/sql/sql_groupby.asp
   *
   * @template T - Entity attributes type
   */
  export type Group<T extends ObjectPlain = ObjectUnknown> = Path<T>

  /**
   * Limit number of results.
   *
   * @template T - Entity attributes type
   */
  export type Limit<T extends ObjectPlain = ObjectUnknown> =
    AllSearchOptions<T>['limit']

  /**
   * Lock rows in a database table.
   *
   * @template M - Entity class
   */
  export type LockOption<M extends Model = Model> =
    | LOCK
    | boolean
    | { level: LOCK; of: ModelStatic<M> }

  /**
   * Transforms objects with `.` separated property names into nested objects
   * using [dottie.js][1]. The query type is assumed to be `'SELECT'`, unless
   * otherwise specified.
   *
   * [1]: https://github.com/mickhansen/dottie.js
   *
   * @example
   *  `{ 'user.username': 'john' }` => `{ user: { username: 'john' } }`
   *
   * @template T - Entity attributes type
   */
  export type Nest<T extends ObjectPlain = ObjectUnknown> =
    AllSearchOptions<T>['nest']

  /**
   * Skip a certain number of results.
   *
   * @template T - Entity attributes type
   */
  export type Offset<T extends ObjectPlain = ObjectUnknown> =
    AllSearchOptions<T>['offset']

  /**
   * Specifies an ordering.
   *
   * If a string is provided, it will be assumed to be the name of a column and
   * escaped.
   *
   * Using an array, you can provide several columns to order by. Each element
   * can be further wrapped in a two-element array.
   *
   * The first element is the name of the column to order by, the second is the
   * direction; e.g: `order: [['name', 'DESC']]`. In this way the column will be
   * escaped, but the direction will not.
   *
   * @see https://sequelize.org/v7/manual/model-querying-basics#ordering-and-grouping
   *
   * @template T - Entity attributes type
   */
  export type Order<T extends ObjectPlain = ObjectUnknown> = (
    | Path<T>
    | [Path<T>, OrderDirection]
  )[]

  /**
   * Filter selected entities.
   *
   * @see https://sequelize.org/v7/manual/model-querying-basics.html#applying-where-clauses
   *
   * @template T - Entity attributes type
   */
  export type Where<T extends ObjectPlain = ObjectUnknown> = {
    [field in keyof T]?:
      | Exclude<WhereValue<T>, ReadonlyArray<any> | Buffer | Col | Fn>
      | Exclude<WhereOptions<T>, Fn>
      | Readonly<OneOrMany<NumberString | WhereAttributeHash<T>>>
  }

  /**
   * Throw an `Exception` if an entity isn't found instead of returning `null`.
   *
   * @template T - Entity attributes type
   */
  export type RejectOnEmpty<T extends ObjectPlain = ObjectUnknown> = Extract<
    AllSearchOptions<T>['rejectOnEmpty'],
    boolean
  >
}

export default SearchOption
