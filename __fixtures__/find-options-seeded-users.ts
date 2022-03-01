import OrderDirection from '@sneusers/modules/db/enums/order-direction.enum'
import type User from '@sneusers/subdomains/users/entities/user.dao'
import type { FindOptions } from 'sequelize'
import { Op } from 'sequelize'

/**
 * @file Fixtures - FIND_OPTIONS_SEEDED_USERS
 * @module fixtures/FIND_OPTIONS_SEEDED_USERS
 */

export default {
  order: [['id', OrderDirection.ASC]],
  where: { email: { [Op.endsWith]: '@seeder.com' } }
} as FindOptions<User>
