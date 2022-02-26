import { Token } from '@sneusers/subdomains/auth/entities'
import type { ITokenRaw } from '@sneusers/subdomains/auth/interfaces'
import type { ModelAttributes } from 'sequelize'
import * as Sequelize from 'sequelize'
import { QueryInterface } from 'sequelize'
import { DataType } from 'sequelize-typescript'
import { DatabaseSequence, DatabaseTable, ReferentialAction } from '../enums'
import { alterSequence, formatTableColumn } from '../utils'

/**
 * @file Database Migrations - create-table-tokens
 * @module sneusers/modules/db/migrations/create-table-tokens
 */

export default {
  /**
   * Drops {@link DatabaseTable.TOKENS}.
   *
   * @async
   * @param {QueryInterface} qi - Sequelize query interface
   * @return {Promise<void>} Empty promise when complete
   */
  async down(qi: QueryInterface): Promise<void> {
    return qi.sequelize.transaction(async transaction => {
      await qi.dropTable(DatabaseTable.TOKENS, { cascade: true, transaction })
      await alterSequence(qi, DatabaseSequence.TOKENS, { owned_by: 'NONE' })
    })
  },

  /**
   * Creates {@link DatabaseTable.TOKENS}.
   *
   * @async
   * @async
   * @param {QueryInterface} qi - Sequelize query interface
   * @param {typeof Sequelize} sequelize - `sequelize` module
   * @return {Promise<void>} Empty promise when complete
   */
  async up(qi: QueryInterface, sequelize: typeof Sequelize): Promise<void> {
    const attributes: ModelAttributes<Token, ITokenRaw> = {
      created_at: {
        allowNull: false,
        comment: 'when token was created (unix timestamp)',
        defaultValue: Token.CURRENT_TIMESTAMP,
        type: DataType.BIGINT,
        validate: { isUnixTimestamp: Token.isUnixTimestamp }
      },
      id: {
        allowNull: false,
        autoIncrementIdentity: true,
        comment: 'unique identifier',
        defaultValue: sequelize.fn('nextval', DatabaseSequence.TOKENS),
        primaryKey: true,
        type: 'NUMERIC',
        unique: true,
        validate: { notNull: true }
      },
      revoked: {
        allowNull: false,
        comment: 'token revoked?',
        defaultValue: false,
        type: DataType.BOOLEAN
      },
      ttl: {
        allowNull: false,
        comment: 'time to live',
        defaultValue: 86_400,
        type: DataType.BIGINT
      },
      type: {
        allowNull: false,
        comment: 'TokenType',
        type: DataType.ENUM(...Token.TYPES)
      },
      user: {
        allowNull: false,
        comment: 'token owner id',
        onDelete: ReferentialAction.CASCADE,
        references: { key: 'id', model: DatabaseTable.USERS },
        type: 'NUMERIC'
      }
    }

    await qi.sequelize.transaction(async transaction => {
      await qi.createTable<Token>(DatabaseTable.TOKENS, attributes, {
        transaction
      })
    })

    await alterSequence(qi, DatabaseSequence.TOKENS, {
      owned_by: formatTableColumn(DatabaseTable.TOKENS, 'id')
    })
  }
}
