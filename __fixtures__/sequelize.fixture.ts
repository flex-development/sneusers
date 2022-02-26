import { Sequelize } from 'sequelize-typescript'
import SequelizeConfig from './sequelize-config-service.fixture'

/**
 * @file Fixtures - Sequelize
 * @module fixtures/Sequelize
 */

export default new Sequelize(SequelizeConfig.createSequelizeOptions())
