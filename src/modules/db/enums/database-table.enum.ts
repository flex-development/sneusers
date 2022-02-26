/**
 * @file DatabaseModule Enums - DatabaseTable
 * @module sneusers/modules/db/enums/DatabaseTable
 */

/**
 * Database table names.
 *
 * @enum {Lowercase<string>}
 */
enum DatabaseTable {
  STORAGE_MIGRATIONS = 'sequelize_meta',
  STORAGE_SEEDERS = 'sequelize_seeds',
  TOKENS = 'tokens',
  USERS = 'users'
}

export default DatabaseTable
