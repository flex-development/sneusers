import { isNIL } from '@flex-development/tutils/guards'
import { ENV } from '@sneusers/config/configuration'
import noop from '@stdlib/utils-noop'
import pg from 'pg'
import {
  AbstractDataTypeConstructor,
  DataTypes,
  Options,
  Sequelize,
  Transaction
} from 'sequelize'
import sequelizeLogger from 'sequelize-log-syntax-colors'
import { AnyFunction } from 'sequelize/types/lib/utils'
import { DatabaseDialect, DatabaseTable } from '../enums'

/**
 * @file DatabaseModule Configuration - Migrations
 * @module sneusers/modules/db/config/migrations
 */

/**
 * Get [`Sequelize`][1] options.
 *
 * [1]: https://sequelize.org/v7
 *
 * @return {Options} Sequelize configuration options
 */
const createSequelizeOptions = (): Options => {
  return {
    benchmark: true,
    database: ENV.DB_NAME,
    define: {
      createdAt: 'created_at',
      deletedAt: 'deleted_at',
      underscored: true,
      updatedAt: 'updated_at'
    },
    dialect: DatabaseDialect.POSTGRES,
    dialectModule: pg,
    dialectOptions: { application_name: ENV.PGAPPNAME },
    hooks: {
      /**
       * Refreshes type parsers for numeric fields.
       *
       * Sequelize converts some numeric fields into strings to prevent overflow
       * errors, but our fields remain small enough that it's (probably) safe
       * to override those parsers.
       *
       * @see https://github.com/sequelize/sequelize/issues/9074#issuecomment-524914844
       *
       * @return {void} Nothing when complete
       */
      beforeConnect(): void {
        /**
         * Clones a data type.
         *
         * @param {AbstractDataTypeConstructor} type - Data type to clone
         * @param {AnyFunction} [parse] - Parse function override
         * @return {AbstractDataTypeConstructor} Cloned data type
         */
        const cloneDataType = (
          type: AbstractDataTypeConstructor,
          parse?: AnyFunction
        ): AbstractDataTypeConstructor => {
          const clone = { key: type.key }

          for (const name of Object.getOwnPropertyNames(type)) {
            clone[name] = type[name]
          }

          if (parse) clone['parse'] = parse

          return clone as unknown as AbstractDataTypeConstructor
        }

        /**
         * Converts `value` into a `boolean`.
         *
         * @param {unknown} value - Value to convert
         * @return {boolean} Parsed value
         */
        const parseBoolean = (value: unknown): boolean => {
          let sanitized = DataTypes.BOOLEAN.prototype._sanitize(value)

          if (sanitized === 'f') sanitized = false
          if (sanitized === 't') sanitized = true

          if (typeof sanitized !== 'boolean') {
            sanitized = isNIL(sanitized) ? false : true
          }

          return sanitized
        }

        return (this as any as Sequelize).connectionManager.refreshTypeParser({
          ...DataTypes,
          BIGINT: cloneDataType(DataTypes.BIGINT, Number.parseInt),
          BOOLEAN: cloneDataType(DataTypes.BOOLEAN, parseBoolean),
          DECIMAL: cloneDataType(DataTypes.DECIMAL, Number.parseFloat),
          INTEGER: cloneDataType(DataTypes.INTEGER, Number.parseInt),
          NUMERIC: cloneDataType(DataTypes.DECIMAL, Number.parseFloat)
        })
      }
    },
    host: ENV.DB_HOST,
    logQueryParameters: ENV.DB_LOG_QUERY_PARAMS,
    logging: ENV.TEST ? noop : sql => console.log(sequelizeLogger(sql)),
    omitNull: false,
    password: ENV.DB_PASSWORD,
    port: ENV.DB_PORT,
    sync: {
      alter: ENV.DB_SYNC_ALTER && { drop: false },
      force: ENV.DB_SYNC_FORCE
    },
    timezone: ENV.DB_TIMEZONE,
    transactionType: Transaction.TYPES.DEFERRED,
    username: ENV.DB_USERNAME
  }
}

export = {
  [ENV.APP_ENV]: {
    ...createSequelizeOptions(),
    migrationStorageTableName: DatabaseTable.STORAGE_MIGRATIONS,
    seederStorageTableName: DatabaseTable.STORAGE_SEEDERS
  }
}
