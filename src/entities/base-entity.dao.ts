import { ObjectPlain } from '@flex-development/tutils'
import { isUnixTimestamp } from '@sneusers/utils'
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
  TModelAttributes extends ObjectPlain = any,
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
   * Checks if `timestamp` is a valid [unix timestamp][1].
   *
   * [1]: https://unixtimestamp.com
   *
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
