import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import { isNIL } from '@flex-development/tutils/guards'
import { QueryInterface } from 'sequelize'
import { AlterSequenceOptions as Options } from './alter-sequence.types'

/**
 * @file DatabaseModule Utilities - alterSequence
 * @module sneusers/modules/db/utils/alterSequence/impl
 */

/**
 * Changes the definition of a sequence generator.
 *
 * @see https://postgresql.org/docs/9.5/sql-altersequence.html
 *
 * @template T - Entity attributes
 *
 * @async
 * @param {QueryInterface} qi - Sequelize query interface
 * @param {string} name - Name of sequence to alter
 * @param {Options<T>} [options=DEFAULTS] - Sequence alter options
 * @return {Promise<[unknown[], unknown][]>} Promise containing query results
 */
async function alterSequence<T extends ObjectUnknown = ObjectPlain>(
  qi: QueryInterface,
  name: string,
  options: Options<T> = DEFAULTS
): Promise<[unknown[], unknown][]> {
  options = { ...DEFAULTS, ...options }

  const sql_base: string[] = [
    'ALTER SEQUENCE',
    options.if_exists ? 'IF EXISTS' : '',
    name,
    isNIL(options.increment) ? '' : `INCREMENT BY ${options.increment}`,
    isNIL(options.minvalue) ? '' : `MINVALUE ${options.minvalue}`,
    isNIL(options.maxvalue) ? '' : `MAXVALUE ${options.maxvalue}`,
    isNIL(options.start) ? '' : `START WITH ${options.start}`,
    isNIL(options.restart) ? '' : `RESTART WITH ${options.restart}`,
    isNIL(options.cache) ? '' : `CACHE ${options.cache}`,
    isNIL(options.cycle) ? '' : options.cycle ? 'CYCLE' : 'NO CYCLE',
    isNIL(options.owned_by) ? '' : `OWNED BY ${options.owned_by.toString()}`
  ].filter(Boolean)

  const sql_new_name: string[] = [
    'ALTER SEQUENCE',
    options.if_exists ? 'IF EXISTS' : '',
    name,
    isNIL(options.new_name) ? '' : `RENAME TO ${options.new_name}`
  ].filter(Boolean)

  const sql_new_owner: string[] = [
    'ALTER SEQUENCE',
    options.if_exists ? 'IF EXISTS' : '',
    name,
    isNIL(options.new_owner) ? '' : `OWNER TO ${options.new_owner}`
  ].filter(Boolean)

  const sql_new_schema: string[] = [
    'ALTER SEQUENCE',
    options.if_exists ? 'IF EXISTS' : '',
    name,
    isNIL(options.new_schema) ? '' : `SET SCHEMA ${options.new_schema}`
  ].filter(Boolean)

  return qi.sequelize.transaction(async transaction => {
    const results: [unknown[], unknown][] = []

    for (const q of [sql_base, sql_new_name, sql_new_owner, sql_new_schema]) {
      const sql = q.join(' ').trim()
      const if_exists = options.if_exists

      if ((if_exists && q.length > 3) || (!if_exists && q.length > 2)) {
        results.push(await qi.sequelize.query(sql, { transaction }))
      }
    }

    return results
  })
}

const DEFAULTS: Required<Options> = {
  cache: undefined as unknown as number,
  cycle: undefined as unknown as boolean,
  if_exists: true,
  increment: undefined as unknown as number,
  maxvalue: undefined as unknown as number,
  minvalue: undefined as unknown as number,
  new_name: undefined as unknown as string,
  new_owner: undefined as unknown as string,
  new_schema: undefined as unknown as string,
  owned_by: undefined as unknown as NonNullable<Options['owned_by']>,
  restart: undefined as unknown as number,
  start: undefined as unknown as number
}

alterSequence.DEFAULTS = DEFAULTS

export default alterSequence
