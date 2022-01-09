import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import { LOCK } from '@sneusers/enums'
import { QueryParams } from '@sneusers/models'
import { SearchOptions } from '@sneusers/types'
import { isUnixTimestamp } from '@sneusers/utils'
import isPlainObject from 'lodash.isplainobject'
import {
  AllowNull,
  AutoIncrement,
  Column,
  Comment,
  DataType,
  Model,
  PrimaryKey,
  Sequelize,
  Unique,
  Validate
} from 'sequelize-typescript'

/**
 * @file Models - BaseEntity
 * @module sneusers/models/BaseEntity
 */

/**
 * Base [domain object][1] class.
 *
 * [1]: https://khalilstemmler.com/articles/domain-driven-design-intro
 *
 * @template TModelAttributes - Entity attributes
 * @template TCreationAttributes - Data to create new {@link BaseEntity}
 */
class BaseEntity<
  TModelAttributes extends ObjectPlain = ObjectPlain,
  TCreationAttributes extends ObjectPlain = TModelAttributes
> extends Model<TModelAttributes, TCreationAttributes> {
  /** @property {TModelAttributes} dataValues - Instance attributes */
  declare dataValues: TModelAttributes

  @Comment('unique identifier for entity')
  @Validate({ notNull: true })
  @AllowNull(false)
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  /**
   * @static
   * @readonly
   * @property {Sequelize} sequelize - Sequelize instance
   */
  static readonly sequelize: Sequelize

  /**
   * Converts query parameters into a search options object.
   *
   * @template T - Entity attributes
   * @template Q - Query parameters
   *
   * @static
   * @param {Q} [query={}] - Query parameters
   * @return {SearchOptions<T>} Search options
   */
  static buildSearchOptions<
    T extends ObjectPlain = ObjectUnknown,
    Q extends ObjectPlain = QueryParams<T>
  >(query: Q = {} as Q): SearchOptions<T> {
    const {
      attributes,
      group,
      having,
      limit = 10,
      lock,
      nest = true,
      offset,
      order,
      rejectOnEmpty: rejectEmpty = false,
      where
    } = query as QueryParams<T>

    const options: SearchOptions<T> = {}

    if (isPlainObject(having)) options.having = having
    if (typeof limit === 'number') options.limit = limit
    if (typeof lock === 'boolean') options.lock = lock
    if (Object.values(LOCK).includes(lock as LOCK)) options.lock = lock
    if (isPlainObject(lock)) options.lock = lock
    if (typeof nest === 'boolean') options.nest = nest
    if (typeof offset === 'number') options.offset = offset
    if (typeof rejectEmpty === 'boolean') options.rejectOnEmpty = rejectEmpty
    if (isPlainObject(where)) options.where = where

    if (typeof attributes === 'string') {
      options.attributes = ['id', ...attributes.toString().split(',')]
      options.attributes = [...new Set(options.attributes).values()]
    }

    if (typeof group === 'string') {
      options.group = group.toString().split(',')
    }

    if (typeof order === 'string') {
      options.order = (
        order.includes('|')
          ? order.split('|').map(column => column.split(','))
          : [order.split(',')]
      ) as SearchOptions<T>['order']
    }

    return options
  }

  /**
   * Checks if `timestamp` is a valid [unix timestamp][1].
   *
   * [1]: https://unixtimestamp.com
   *
   * @static
   * @param {any} timestamp - Value to check
   * @return {true} `true` if unix timestamp
   * @throws {Error}
   */
  static checkUnixTimestamp(timestamp: any): true {
    if (isUnixTimestamp(timestamp)) return true
    throw new Error('Must be a unix timestamp')
  }
}

export default BaseEntity
