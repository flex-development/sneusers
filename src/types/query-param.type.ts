import type {
  NumberString,
  ObjectPlain,
  ObjectUnknown,
  OneOrMany,
  Path
} from '@flex-development/tutils'
import type { LOCK } from '@sneusers/enums'
import type { WhereAttributeHash, WhereOptions, WhereValue } from 'sequelize'
import type { Model, ModelStatic } from 'sequelize-typescript'
import type { Col, Fn } from 'sequelize/dist/lib/utils'
import type SearchOptions from './search-options.type'

/**
 * @file Type Definitions - QueryParam
 * @module sneusers/types/QueryParam
 */

/**
 * Sequelize query options that can be passed via URL search parameters.
 *
 * **NOTE**: Some option types may be modified to support URL queries.
 *
 * @see {@link SearchOptions}
 *
 * @see https://sequelize.org/v7/manual/model-querying-basics
 * @see https://sequelize.org/v7/manual/model-querying-finders
 */
namespace QueryParam {
  /**
   * Comma-delimited list of the attributes to select.
   *
   * @template T - Entity attributes
   */
  export type Attributes<T extends ObjectPlain = ObjectUnknown> =
    | Path<T>
    | string

  /**
   * Comma-delimitted list representing [`GROUP BY`][1] in sql.
   *
   * [1]: https://www.w3schools.com/sql/sql_groupby.asp
   *
   * @template T - Entity attributes
   */
  export type Group<T extends ObjectPlain = ObjectUnknown> = Path<T> | string

  /**
   * Limit number of results.
   *
   * @template T - Entity attributes
   */
  export type Limit<T extends ObjectPlain = ObjectUnknown> =
    SearchOptions<T>['limit']

  /**
   * Lock rows in a database table.
   *
   * @template M - Entity class
   */
  export type Lock<M extends Model = Model> =
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
   * @template T - Entity attributes
   */
  export type Nest<T extends ObjectPlain = ObjectUnknown> =
    SearchOptions<T>['nest']

  /**
   * Skip a certain number of results.
   *
   * @template T - Entity attributes
   */
  export type Offset<T extends ObjectPlain = ObjectUnknown> =
    SearchOptions<T>['offset']

  /**
   * Comma and/or bar delimited list that specifies how to sort results.
   *
   * If the list contains only commas, or no separators at all, the list will be
   * assumed to be a list of column names.
   *
   * @example 'id'
   * @example 'id,last_name'
   *
   * Using a bar-delimited list, you can provide several columns to order by.
   *
   * @example 'id,ASC|name,DESC'
   *
   * @see https://sequelize.org/v7/manual/model-querying-basics#ordering-and-grouping
   *
   * @template T - Entity attributes
   */
  export type Order<T extends ObjectPlain = ObjectUnknown> = Path<T> | string

  /**
   * Filter selected entities.
   *
   * @see https://sequelize.org/v7/manual/model-querying-basics.html#applying-where-clauses
   *
   * @template T - Entity attributes
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
   * @template T - Entity attributes
   */
  export type RejectOnEmpty<T extends ObjectPlain = ObjectUnknown> = Extract<
    SearchOptions<T>['rejectOnEmpty'],
    boolean
  >
}

export default QueryParam
