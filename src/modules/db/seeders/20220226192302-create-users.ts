import faker from '@faker-js/faker'
import FIXTURE_MAGIC_NUMBER from '@fixtures/magic-number.fixture'
import FIXTURE_USER_PASSWORD from '@fixtures/user-password.fixture'
import User from '@sneusers/subdomains/users/entities/user.dao'
import type { CreationAttributes, WhereOptions } from 'sequelize'
import { Op, QueryInterface } from 'sequelize'
import { DatabaseSequence, DatabaseTable } from '../enums'
import { alterSequence } from '../utils'

/**
 * @file Database Seeders - create-users
 * @module sneusers/modules/db/seeders/create-users
 */

/** @property {User[]} seeded - Users inserted into database */
let seeded: User[] = []

export default {
  /**
   * Removes {@link seeded} users.
   *
   * @async
   * @param {QueryInterface} qi - Sequelize query interface
   * @return {Promise<void>} Empty promise when complete
   */
  async down(qi: QueryInterface): Promise<void> {
    return qi.sequelize.transaction(async transaction => {
      const users = seeded.map(user => user.id).sort((u1, u2) => u1 - u2)
      const where: WhereOptions<User> = { id: { [Op.in]: users } }

      await qi.bulkDelete(DatabaseTable.USERS, where, { transaction })
      await alterSequence(qi, DatabaseSequence.USERS, { restart: 0 })
    })
  },

  /**
   * Creates `FIXTURE_MAGIC_NUMBER * 2` number of users.
   *
   * @async
   * @param {QueryInterface} qi - Sequelize query interface
   * @return {Promise<void>} Empty promise when complete
   */
  async up(qi: QueryInterface): Promise<void> {
    return qi.sequelize.transaction(async transaction => {
      const max = FIXTURE_MAGIC_NUMBER * 2
      const seeds: CreationAttributes<User>[] = []

      for (let id = 0; id < max; id++) {
        const display_name: string = ['seed', '_', id].join('')

        seeds.push({
          display_name,
          email: [display_name, '@', 'seeder.com'].join(''),
          first_name: faker.name.firstName(),
          id,
          last_name: faker.name.lastName(),
          password: FIXTURE_USER_PASSWORD
        })
      }

      seeded = await User.bulkCreate(seeds, {
        fields: User.KEYS_RAW,
        individualHooks: true,
        transaction,
        validate: true
      })

      await alterSequence(qi, DatabaseSequence.USERS, { restart: max })
    })
  }
}
