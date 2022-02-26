import type { NumberString, ObjectPlain } from '@flex-development/tutils'
import { OrNull, PathValue } from '@flex-development/tutils'
import { isUnixTimestamp } from '@flex-development/tutils/guards'
import { ENV } from '@sneusers/config/configuration'
import type { ExceptionDataDTO } from '@sneusers/dtos'
import { Exception } from '@sneusers/exceptions'
import { QueryParams } from '@sneusers/models'
import { ScryptService } from '@sneusers/modules/crypto/providers'
import isPlainObject from 'lodash.isplainobject'
import { BuildOptions, Sequelize } from 'sequelize'
import { Model, ModelStatic } from 'sequelize-typescript'
import type { Literal } from 'sequelize/types/lib/utils'
import { LOCK, SequelizeError } from '../enums'
import type { EntityAttributes } from '../namespaces'
import { SearchOptions, SequelizeErrorType } from '../types'

/**
 * @file DatabaseModule Entities - Entity
 * @module sneusers/modules/db/entities/Entity
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
 * @template TCreationAttributes - Data to create new {@link Entity}
 * @template VirtualFields - [Virtual fields][2] (with or without attributes)
 *
 * @abstract
 */
abstract class Entity<
  TModelAttributes extends ObjectPlain = ObjectPlain,
  TCreationAttributes extends ObjectPlain = TModelAttributes,
  VirtualFields extends ObjectPlain = never
> extends Model<TModelAttributes, TCreationAttributes> {
  /**
   * @static
   * @readonly
   * @property {Literal | number} CURRENT_TIMESTAMP - Current unix timestamp
   * @see https://www.w3resource.com/PostgreSQL/extract-function.php
   */
  static readonly CURRENT_TIMESTAMP: Literal | number = !ENV.TEST
    ? Sequelize.literal('EXTRACT(epoch FROM now())')
    : Date.now()

  /**
   * @static
   * @readonly
   * @property {ScryptService} scrypt - {@link ScryptService} instance
   */
  static readonly scrypt: ScryptService = new ScryptService()

  /**
   * Virtual attributes helper.
   *
   * This is a dummy variable that doesn't exist on the real object.
   * Do not try to access this in real code.
   */
  declare _virtualAttributes: EntityAttributes.Virtual<
    TModelAttributes,
    VirtualFields
  >

  /** @property {TModelAttributes} dataValues - Instance attributes */
  declare dataValues: TModelAttributes

  /**
   * @abstract
   * @property {number} id - Unique identifier
   */
  abstract id: number

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
   * Creates a new `Entity` instance.
   *
   * [1]: https://sequelize.org/v7/class/src/model.js~Model#static-method-build
   *
   * @param {TCreationAttributes} values - Data transfer object
   * @param {BuildOptions} [options] - Sequelize [`build`][1] options
   */
  constructor(values?: TCreationAttributes, options?: BuildOptions) {
    super(values, options)

    /**
     * Adding a [public class field][1] with the same name as an attribute is an
     * issue. As a workaround, we use `declare` to add type information without
     * declaring a public class field.
     *
     * There are a still a few cases, however, where it seems that transpiled
     * classes are resetting `sequelize` properties getters & setters.
     *
     * This snippet fixes these properties by re-defining them.
     *
     * [1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes/Public_class_fields
     *
     * @see https://github.com/sequelize/sequelize/issues/10579#issuecomment-574604414
     * @see https://github.com/sequelize/sequelize/issues/10579#issuecomment-728932006
     * @see https://github.com/sequelize/sequelize/blob/main/docs/manual/core-concepts/model-basics.md#caveat-with-public-class-fields
     */
    for (const key of [
      ...Object.keys(new.target.rawAttributes),
      ...Object.keys(new.target.associations)
    ]) {
      const attribute = key as keyof TModelAttributes

      Object.defineProperty(this, attribute, {
        get(): PathValue<TModelAttributes, keyof TModelAttributes> {
          return (this as Entity).getDataValue(attribute)
        },
        set(value: PathValue<TModelAttributes, keyof TModelAttributes>): void {
          return (this as Entity).setDataValue(attribute, value)
        }
      })
    }
  }

  /**
   * Checks if `timestamp` is a valid [unix timestamp][1].
   *
   * [1]: https://unixtimestamp.com
   *
   * @static
   * @param {any} timestamp - Value to check
   * @return {true} `true` if `timestamp` is unix timestamp
   * @throws {Error}
   */
  static isUnixTimestamp(timestamp: any): true {
    if (isUnixTimestamp(timestamp)) return true
    throw new Error('Must be a unix timestamp')
  }

  /**
   * Checks if `timestamp` is a valid [unix timestamp][1] or `null`.
   *
   * [1]: https://unixtimestamp.com
   *
   * @static
   * @param {any} timestamp - Value to check
   * @return {true} `true` if `timestamp` is unix timestamp or `null`
   * @throws {Error}
   */
  static isUnixTimestampOrNull(timestamp: any): true {
    if (timestamp === null || isUnixTimestamp(timestamp)) return true
    throw new Error('Must be a unix timestamp or null')
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
  static override async findByPk<M extends Entity>(
    this: ModelStatic<M> | (Model & ModelStatic<M>),
    pk: NumberString,
    options: Omit<SearchOptions<M>, 'where'> = {}
  ): Promise<OrNull<M>> {
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
      return await super.findByPk<M>(key, options)
    } catch (e) {
      const error = e as SequelizeErrorType
      const primary_key: string = this['primaryKeyAttribute']
      const data: ExceptionDataDTO<SequelizeErrorType> = { [primary_key]: pk }

      data.pk = key
      data.options = options

      if (error.name === SequelizeError.EmptyResult) {
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
  static getSearchOptions<M extends Entity>(
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

export default Entity
