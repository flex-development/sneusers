import { User } from '@sneusers/subdomains/users/entities'
import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import type { ModelAttributes } from 'sequelize'
import * as Sequelize from 'sequelize'
import { QueryInterface } from 'sequelize'
import { DataType } from 'sequelize-typescript'
import { DatabaseSequence, DatabaseTable } from '../enums'
import { alterSequence, formatTableColumn } from '../utils'

/**
 * @file Database Migrations - create-table-users
 * @module sneusers/modules/db/migrations/create-table-users
 */

export default {
  /**
   * Drops {@link DatabaseTable.USERS}.
   *
   * @async
   * @param {QueryInterface} qi - Sequelize query interface
   * @return {Promise<void>} Empty promise when complete
   */
  async down(qi: QueryInterface): Promise<void> {
    return qi.sequelize.transaction(async transaction => {
      await qi.dropTable(DatabaseTable.USERS, { cascade: true, transaction })
      await alterSequence(qi, DatabaseSequence.USERS, { owned_by: 'NONE' })
    })
  },

  /**
   * Creates {@link DatabaseTable.USERS} and its indices.
   *
   * @async
   * @param {QueryInterface} qi - Sequelize query interface
   * @param {typeof Sequelize} sequelize - `sequelize` module
   * @return {Promise<void>} Empty promise when complete
   */
  async up(qi: QueryInterface, sequelize: typeof Sequelize): Promise<void> {
    const attributes: ModelAttributes<User, IUserRaw> = {
      created_at: {
        allowNull: false,
        comment: 'when user was created (unix timestamp)',
        defaultValue: User.CURRENT_TIMESTAMP,
        type: DataType.BIGINT,
        validate: { isUnixTimestamp: User.isUnixTimestamp }
      },
      display_name: {
        allowNull: true,
        comment: 'display name',
        defaultValue: null,
        type: DataType.STRING,
        validate: { notEmpty: true }
      },
      email: {
        allowNull: false,
        comment: 'unique email address',
        type: DataType.STRING(254),
        unique: true,
        validate: { isEmail: true, len: [3, 254] }
      },
      email_verified: {
        allowNull: false,
        comment: 'email address verified?',
        defaultValue: false,
        type: DataType.BOOLEAN
      },
      first_name: {
        allowNull: true,
        comment: 'first name of user',
        defaultValue: null,
        type: DataType.STRING,
        validate: { notEmpty: true }
      },
      id: {
        allowNull: false,
        autoIncrementIdentity: true,
        comment: 'unique identifier',
        defaultValue: sequelize.fn('nextval', DatabaseSequence.USERS),
        primaryKey: true,
        type: 'NUMERIC',
        unique: true,
        validate: { notNull: true }
      },
      last_name: {
        allowNull: true,
        comment: 'last name of user',
        defaultValue: null,
        type: DataType.STRING,
        validate: { notEmpty: true }
      },
      password: {
        allowNull: true,
        comment: 'hashed password',
        defaultValue: null,
        type: DataType.STRING,
        validate: { isStrong: User.checkPasswordStrength }
      },
      provider: {
        allowNull: true,
        comment: 'OAuthProvider',
        defaultValue: null,
        type: DataType.ENUM(...User.AUTH_PROVIDERS)
      },
      updated_at: {
        allowNull: true,
        comment: 'when user was last modified (unix timestamp)',
        defaultValue: null,
        type: DataType.BIGINT,
        validate: { isUnixTimestamp: User.isUnixTimestampOrNull }
      }
    }

    await qi.sequelize.transaction(async transaction => {
      await qi.createTable<User>(DatabaseTable.USERS, attributes, {
        transaction
      })
    })

    await qi.sequelize.transaction(async transaction => {
      for (const attribute of Object.keys(attributes)) {
        if (attribute === 'password') continue

        await qi.addIndex(DatabaseTable.USERS, {
          fields: [attribute],
          name: attribute,
          transaction,
          unique: !!attributes[attribute].unique
        })
      }
    })

    await alterSequence(qi, DatabaseSequence.USERS, {
      owned_by: formatTableColumn(DatabaseTable.USERS, 'id')
    })
  }
}
