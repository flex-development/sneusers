import { DatabaseTable } from '@sneusers/enums'
import { QueryInterface } from 'sequelize'
import { BulkDeleteResponse } from './types'

/**
 * @file Global Test Utilities - resetSequence
 * @module tests/utils/resetSequence
 */

/**
 * Clears a row in the the {@link DatabaseTable.SQLITE_SEQUENCE} table.
 *
 * @async
 * @param {QueryInterface} queryInterface - Current queryInterface
 * @param {DatabaseTable} name - Row name
 * @return {Promise<BulkDeleteResponse>} Promise containing deleted rows
 */
const resetSequence = async (
  queryInterface: QueryInterface,
  name: DatabaseTable
): Promise<BulkDeleteResponse> => {
  return await queryInterface.bulkDelete(DatabaseTable.SQLITE_SEQUENCE, {
    name
  })
}

export default resetSequence
