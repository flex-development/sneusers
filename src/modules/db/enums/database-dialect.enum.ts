import { Dialect } from 'sequelize'

/**
 * @file DatabaseModule Enums - DatabaseDialect
 * @module sneusers/modules/db/enums/DatabaseDialect
 */

/**
 * Database dialects.
 *
 * @see {@link Dialect}
 *
 * @enum {Dialect}
 */
enum DatabaseDialect {
  MARIADB = 'mariadb',
  MSSQL = 'mssql',
  MYSQL = 'mysql',
  POSTGRES = 'postgres',
  SQLITE = 'sqlite'
}

export default DatabaseDialect
