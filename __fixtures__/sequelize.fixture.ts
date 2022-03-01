import Token from '@sneusers/subdomains/auth/entities/token.dao'
import User from '@sneusers/subdomains/users/entities/user.dao'
import { Sequelize } from 'sequelize-typescript'
import config from './sequelize-config-service.fixture'

/**
 * @file Fixtures - Sequelize
 * @module fixtures/Sequelize
 */

export default new Sequelize({
  ...config.createSequelizeOptions(),
  models: [Token, User],
  repositoryMode: false
})
