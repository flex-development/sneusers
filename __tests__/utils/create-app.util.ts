import { ModuleMetadata } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import useGlobal from '@sneusers/hooks/use-global.hook'
import { AppService } from '@sneusers/providers'
import sequelize_config from '@tests/fixtures/sequelize-config-service.fixture'
import createTestingModule from './creating-testing-module.util'
import { NestTestApp } from './types'

/**
 * @file Global Test Utilities - createApp
 * @module tests/utils/createApp
 */

/**
 * Returns a NestJS test app and module reference.
 *
 * @see https://docs.nestjs.com/fundamentals/testing#end-to-end-testing
 *
 * @async
 * @param {ModuleMetadata} metadata - Module metadata
 * @param {any} [provider] - Test provider
 * @param {any} [value] - Test provider value
 * @return {Promise<NestTestApp>} NestJS test app and module reference
 */
const createApp = async (
  metadata: ModuleMetadata,
  provider?: any,
  value?: any
): Promise<NestTestApp> => {
  const imports = [
    ConfigModule.forRoot(AppService.configModuleOptions),
    SequelizeModule.forRoot(sequelize_config.createSequelizeOptions())
  ]

  if (metadata.imports) metadata.imports = [...imports, ...metadata.imports]
  if (!metadata.imports) metadata.imports = imports

  const module_ref = await createTestingModule(metadata, provider, value)
  const app = await useGlobal(module_ref.createNestApplication())

  return { app, module_ref }
}

export default createApp
