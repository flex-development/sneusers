import { Umzug } from 'umzug'
import UmzugConfig from './umzug-config-service.fixture'

/**
 * @file Global Test Fixture - Umzug
 * @module tests/fixtures/Umzug
 */

export default new Umzug(UmzugConfig.createUmzugOptions())
