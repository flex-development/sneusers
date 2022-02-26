import { Sequelize } from 'sequelize-typescript'
import SequelizeConfig from './sequelize-config-service.fixture'

/**
 * @file Global Test Fixture - Sequelize
 * @module tests/fixtures/Sequelize
 */

export default new Sequelize(SequelizeConfig.createSequelizeOptions())
