import { ObjectPlain } from '@flex-development/tutils'
import { ENV } from '@sneusers/config/configuration'
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
export default class BaseEntity<
  TModelAttributes extends ObjectPlain = any,
  TCreationAttributes extends ObjectPlain = TModelAttributes
> extends Model<TModelAttributes, TCreationAttributes> {
  @Comment('unique identifier for entity')
  @Unique
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Validate({ notNull: true })
  @Column(ENV.TEST ? DataType.INTEGER : DataType.INTEGER.UNSIGNED)
  declare id: number

  /**
   * @static
   * @readonly
   * @property {Sequelize} sequelize - Sequelize instance
   */
  static readonly sequelize: Sequelize
}
