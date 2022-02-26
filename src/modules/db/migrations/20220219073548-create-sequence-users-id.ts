import { QueryInterface } from 'sequelize'
import { DatabaseSequence } from '../enums'
import {
  createSequence,
  dropSequence,
  DropSequenceDependencies
} from '../utils'

/**
 * @file Database Migrations - create-sequence-users-id
 * @module sneusers/modules/db/migrations/create-sequence-users-id
 */

export default {
  /**
   * Drops {@link DatabaseSequence.USERS}.
   *
   * @async
   * @param {QueryInterface} qi - Sequelize query interface
   * @return {Promise<void>} Empty promise when complete
   */
  async down(qi: QueryInterface): Promise<void> {
    await dropSequence(qi, DatabaseSequence.USERS, {
      dependencies: DropSequenceDependencies.CASCADE
    })
  },

  /**
   * Creates {@link DatabaseSequence.USERS}.
   *
   * @async
   * @param {QueryInterface} qi - Sequelize query interface
   * @return {Promise<void>} Empty promise when complete
   */
  async up(qi: QueryInterface): Promise<void> {
    await createSequence(qi, DatabaseSequence.USERS, { minvalue: 0, start: 0 })
  }
}
