/**
 * @file Enums - DatabaseTable
 * @module sneusers/enums/DatabaseTable
 */

/**
 * Database table names.
 *
 * @enum {string}
 */
enum DatabaseTable {
  REFRESH_TOKENS = 'refresh_tokens',
  SQLITE_SEQUENCE = 'sqlite_sequence',
  USERS = 'users'
}

export default DatabaseTable
