import FIXTURE_MAGIC_NUMBER from '@fixtures/magic-number.fixture'
import { ENV } from '@sneusers/config/configuration'
import Token from '@sneusers/subdomains/auth/entities/token.dao'
import TokenType from '@sneusers/subdomains/auth/enums/token-type.enum'
import User from '@sneusers/subdomains/users/entities/user.dao'
import type { CreationAttributes, WhereOptions } from 'sequelize'
import { Op, QueryInterface } from 'sequelize'
import { DatabaseTable } from '../enums'

/**
 * @file Database Seeders - create-tokens
 * @module sneusers/modules/db/seeders/create-tokens
 */

/** @property {Token[]} seeded - Tokens inserted into database */
let seeded: Token[] = []

export default {
  /**
   * Removes {@link seeded} tokens.
   *
   * @async
   * @param {QueryInterface} qi - Sequelize query interface
   * @return {Promise<void>} Empty promise when complete
   */
  async down(qi: QueryInterface): Promise<void> {
    return qi.sequelize.transaction(async transaction => {
      const tokens = seeded.map(token => token.id).sort((t1, t2) => t1 - t2)
      const where: WhereOptions<Token> = { id: { [Op.in]: tokens } }

      await qi.bulkDelete(DatabaseTable.TOKENS, where, { transaction })
    })
  },

  /**
   * Creates `FIXTURE_MAGIC_NUMBER * 2` number of tokens.
   *
   * @async
   * @param {QueryInterface} qi - Sequelize query interface
   * @return {Promise<void>} Empty promise when complete
   */
  async up(qi: QueryInterface): Promise<void> {
    return qi.sequelize.transaction(async transaction => {
      const seeds: CreationAttributes<Token>[] = []

      for (let pk = 0; pk < FIXTURE_MAGIC_NUMBER * 2; pk++) {
        const user = (await User.findByPk(pk))!.id

        seeds.push({
          ttl: ENV.JWT_EXP_REFRESH,
          type: TokenType.REFRESH,
          user
        })

        seeds.push({
          ttl: ENV.JWT_EXP_ACCESS,
          type: TokenType.ACCESS,
          user
        })
      }

      seeded = await Token.bulkCreate(seeds, {
        fields: Token.KEYS_RAW,
        individualHooks: true,
        transaction,
        validate: true
      })
    })
  }
}
