import { QueryInterface } from 'sequelize'
import {
  DropSequenceDependencies,
  DropSequenceOptions as Options
} from './drop-sequence.types'

/**
 * @file DatabaseModule Utilities - dropSequence
 * @module sneusers/modules/db/utils/dropSequence/impl
 */

/**
 * Removes a sequence.
 *
 * @see https://postgresql.org/docs/9.5/sql-dropsequence.html
 *
 * @async
 * @param {QueryInterface} qi - Sequelize query interface
 * @param {string} name - Name of sequence to drop
 * @param {Options} [options=DEFAULTS] - Sequence creation options
 * @return {Promise<[unknown[], unknown]>} Promise containing query result
 */
const dropSequence = async (
  qi: QueryInterface,
  name: string,
  options: Options = DEFAULTS
): Promise<[unknown[], unknown]> => {
  options = { ...DEFAULTS, ...options }

  const sql: string[] = [
    'DROP SEQUENCE',
    options.if_exists ? 'IF EXISTS' : '',
    name,
    options.dependencies!
  ].filter(Boolean)

  return qi.sequelize.transaction(async transaction => {
    return qi.sequelize.query(sql.join(' ').trim(), { transaction })
  })
}

const DEFAULTS: Required<Options> = {
  dependencies: DropSequenceDependencies.RESTRICT,
  if_exists: true
}

dropSequence.DEFAULTS = DEFAULTS

export default dropSequence
