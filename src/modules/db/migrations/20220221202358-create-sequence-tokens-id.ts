import { QueryInterface } from 'sequelize'
import { DatabaseSequence } from '../enums'
import {
  createSequence,
  dropSequence,
  DropSequenceDependencies
} from '../utils'

/**
 * @file Database Migrations - create-sequence-tokens-id
 * @module sneusers/modules/db/migrations/create-sequence-tokens-id
 */

export default {
  /**
   * Drops {@link DatabaseSequence.TOKENS}.
   *
   * @async
   * @param {QueryInterface} qi - Sequelize query interface
   * @return {Promise<void>} Empty promise when complete
   */
  async down(qi: QueryInterface): Promise<void> {
    await dropSequence(qi, DatabaseSequence.TOKENS, {
      dependencies: DropSequenceDependencies.CASCADE
    })
  },

  /**
   * Creates {@link DatabaseSequence.TOKENS}.
   *
   * @async
   * @param {QueryInterface} qi - Sequelize query interface
   * @return {Promise<void>} Empty promise when complete
   */
  async up(qi: QueryInterface): Promise<void> {
    await createSequence(qi, DatabaseSequence.TOKENS, { minvalue: 0, start: 0 })
  }
}
