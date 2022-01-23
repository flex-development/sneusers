import type { NumberString, ObjectPlain } from '@flex-development/tutils'
import { OrNull } from '@flex-development/tutils'
import type { ExceptionDataDTO } from '@sneusers/dtos'
import { LOCK, SequelizeErrorName } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { QueryParams } from '@sneusers/models'
import { HashService } from '@sneusers/modules/crypto/providers'
import type { ModelAttributes, SequelizeError } from '@sneusers/types'
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
  ModelStatic,
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
 * Base [data access object][1] class.
 *
 * [1]: https://en.wikipedia.org/wiki/Data_access_object
 * [2]: https://sequelize.org/v7/manual/getters-setters-virtuals#virtual-fields
 *
 * @see https://khalilstemmler.com/articles/domain-driven-design-intro
 *
 * @template TModelAttributes - Entity attributes
 * @template TCreationAttributes - Data to create new {@link BaseEntity}
 * @template VirtualFields - [Virtual fields][2] (with or without attributes)
 *
 * @abstract
 */
abstract class BaseEntity<
  TModelAttributes extends ObjectPlain = ObjectPlain,
  TCreationAttributes extends ObjectPlain = TModelAttributes,
  VirtualFields extends ObjectPlain = never
> extends Model<TModelAttributes, TCreationAttributes> {
  /**
   * @static
   * @readonly
   * @property {string} CURRENT_TIMESTAMP - Stringified `strftime` call
   * @see https://www.w3resource.com/sqlite/sqlite-strftime.php
   */
  static readonly CURRENT_TIMESTAMP: string = "strftime('%s','now')"

  /**
   * @protected
   * @static
   * @readonly
   * @property {HashService} secrets - Hashing service
   */
  protected static readonly secrets: HashService = new HashService()

  /**
   * Virtual attributes helper.
   *
   * This is a dummy variable that doesn't exist on the real object.
   * Do not try to access this in real code.
   */
  declare _virtualAttributes: ModelAttributes.Virtual<
    TModelAttributes,
    VirtualFields
  >

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
   * @property {string} primaryKeyAttribute - Name of the primary key attribute
   */
  static readonly primaryKeyAttribute: string = 'id'

  /**
   * @static
   * @readonly
   * @property {Sequelize} sequelize - Sequelize instance
   */
  static readonly sequelize: Sequelize

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

  /**
   * Retrieve a token by entity by `id`.
   *
   * If an entity isn't found, `null` will be returned. To force the function to
   * throw an {@link Exception} instead, set `options.rejectOnEmpty=true`.
   *
   * [1]: https://en.wikipedia.org/wiki/Data_access_object
   *
   * @see {@link SearchOptions}
   *
   * @template M - [Data access object][1] class
   *
   * @static
   * @async
   * @param {ModelStatic<M>} this - [Data access object][1] class
   * @param {NumberString} pk - Primary key of entity to find
   * @param {Omit<SearchOptions<M>, 'where'>} [options={}] - Search options
   * @return {Promise<OrNull<M>>} Entity object or `null`
   * @throws {Exception}
   */
  static override async findByPk<M extends BaseEntity>(
    this: ModelStatic<M>,
    pk: NumberString,
    options: Omit<SearchOptions<M>, 'where'> = {}
  ): Promise<OrNull<M>> {
    const find_options: typeof options = { ...options, plain: true }
    let key: typeof pk = pk.toString()

    if (typeof key === 'string') key = Number.parseInt(key)
    if (!['bigint', 'number'].includes(typeof key)) key = Number.NaN
    if (Number.isNaN(key)) key = -1

    try {
      // @ts-expect-error No overload matches this call. ts(2769)
      //
      // Overload 1 of 2, '(this: ModelStatic<M>, identifier: Identifier,
      // options: Omit<NonNullFindOptions<M["_attributes"]>, "where">):
      // Promise<...>', gave the following error: The 'this' context of type
      // 'typeof Model' is not assignable to  method's 'this' of type
      // 'ModelStatic<M>'. Cannot assign an abstract constructor type to a
      // non-abstract constructor type.
      //
      // Overload 2 of 2, '(this: ModelStatic<M>, identifier?: Identifier |
      // undefined, options?: Omit<FindOptions<M["_attributes"]>, "where"> |
      // undefined): Promise<...>', gave the following error: The 'this' context
      // of type 'typeof Model' is not assignable to method's 'this' of type
      // 'ModelStatic<M>'
      return await super.findByPk<M>(key, find_options)
    } catch (e) {
      const error = e as SequelizeError
      const primary_key: string = this['primaryKeyAttribute']
      const data: ExceptionDataDTO<SequelizeError> = { [primary_key]: pk }

      data.pk = key
      data.options = find_options

      if (error.name === SequelizeErrorName.EmptyResult) {
        data.message = `${this.name} with ${primary_key} [${pk}] not found`
      }

      throw Exception.fromSequelizeError(error, data)
    }
  }

  /**
   * Converts query parameters into a search options object.
   *
   * [1]: https://en.wikipedia.org/wiki/Data_access_object
   *
   * @template M - [Data access object][1] class
   *
   * @static
   * @param {ModelStatic<M>} this - [Data access object][1] class
   * @param {QueryParams<M>} [query={}] - Query params
   * @return {SearchOptions<M>} Search options
   */
  static getSearchOptions<M extends BaseEntity>(
    this: ModelStatic<M>,
    query: QueryParams<M> = {}
  ): SearchOptions<M> {
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
    } = query

    const options: SearchOptions<M> = {}

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
      ) as SearchOptions<M>['order']
    }

    return options
  }
}

export default BaseEntity
