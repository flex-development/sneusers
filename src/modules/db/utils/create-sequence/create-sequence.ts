import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import { isNIL } from '@flex-development/tutils/guards'
import { QueryInterface } from 'sequelize'
import { CreateSequenceOptions as Options } from './create-sequence.types'

/**
 * @file DatabaseModule Utilities - createSequence
 * @module sneusers/modules/db/utils/createSequence/impl
 */

/**
 * Defines a new sequence generator.
 *
 * @see https://postgresql.org/docs/9.5/sql-createsequence.html
 *
 * @template T - Entity attributes
 *
 * @async
 * @param {QueryInterface} qi - Sequelize query interface
 * @param {string} name - Name of sequence to create
 * @param {Options<T>} [options=DEFAULTS] - Sequence creation options
 * @return {Promise<[unknown[], unknown]>} Promise containing query result
 */
async function createSequence<T extends ObjectPlain = ObjectUnknown>(
  qi: QueryInterface,
  name: string,
  options: Options<T> = DEFAULTS
): Promise<[unknown[], unknown]> {
  options = { ...DEFAULTS, ...options }

  const sql: string[] = [
    'CREATE',
    options.temp ? 'TEMPORARY' : '',
    'SEQUENCE',
    options.if_not_exists ? 'IF NOT EXISTS' : '',
    name,
    `INCREMENT BY ${options.increment}`,
    isNIL(options.minvalue) ? '' : `MINVALUE ${options.minvalue}`,
    isNIL(options.maxvalue) ? '' : `MAXVALUE ${options.maxvalue}`,
    isNIL(options.start) ? '' : `START WITH ${options.start}`,
    `CACHE ${options.cache}`,
    options.cycle ? 'CYCLE' : 'NO CYCLE',
    `OWNED BY ${options.owned_by!.toString()}`
  ].filter(Boolean)

  return qi.sequelize.transaction(async transaction => {
    return qi.sequelize.query(sql.join(' ').trim(), { transaction })
  })
}

const DEFAULTS: Required<Options> = {
  cache: 1,
  cycle: false,
  if_not_exists: true,
  increment: 1,
  maxvalue: undefined as unknown as number,
  minvalue: undefined as unknown as number,
  owned_by: 'NONE',
  start: undefined as unknown as number,
  temp: false
}

createSequence.DEFAULTS = DEFAULTS

export default createSequence
