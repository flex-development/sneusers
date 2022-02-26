import DatabaseTable from './database-table.enum'

/**
 * @file DatabaseModule Enums - DatabaseSequence
 * @module sneusers/modules/db/enums/DatabaseSequence
 */

/**
 * Database sequence names.
 *
 * @enum {Lowercase<string>}
 */
const DatabaseSequence = Object.freeze({
  TOKENS: `${DatabaseTable.TOKENS}_id_seq`,
  USERS: `${DatabaseTable.USERS}_id_seq`
})

export default DatabaseSequence
