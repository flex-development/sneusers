import SQL from '@nearform/sql'
import { QueryInterface } from 'sequelize'

/**
 * @file DatabaseModule Utilities - nextval
 * @module sneusers/modules/db/utils/nextval/impl
 */

/**
 * Retrieves the next value from an existing sequence.
 *
 * @async
 * @param {QueryInterface} qi - Sequelize query interface
 * @param {string} sequence - Name of sequence to get next value from
 * @return {Promise<number>} Promise containing next sequence value
 */
const nextval = async (
  qi: QueryInterface,
  sequence: string
): Promise<number> => {
  const sql = SQL`SELECT nextval('${SQL.unsafe(sequence)}')`
  const next = await qi.sequelize.query(sql.text, { plain: true, raw: true })

  return next!.nextval as number
}

export default nextval
