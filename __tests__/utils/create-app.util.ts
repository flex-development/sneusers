import { ModuleMetadata } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import useGlobal from '@sneusers/hooks/use-global.hook'
import CryptoModule from '@sneusers/modules/crypto/crypto.module'
import EmailModule from '@sneusers/modules/email/email.module'
import { AppService } from '@sneusers/providers'
import SequelizeConfig from '@tests/fixtures/sequelize-config-service.fixture'
import { Sequelize } from 'sequelize-typescript'
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
 * @param {ModuleMetadata} [metadata={}] - Module metadata
 * @param {any} [provider] - Test provider
 * @param {any} [value] - Test provider value
 * @return {Promise<NestTestApp>} NestJS test app and module reference
 */
const createApp = async (
  metadata: ModuleMetadata = {},
  provider?: any,
  value?: any
): Promise<NestTestApp> => {
  const imports = [
    ConfigModule.forRoot(AppService.configModuleOptions),
    CryptoModule,
    EmailModule,
    SequelizeModule.forRoot(SequelizeConfig.createSequelizeOptions())
  ]

  if (metadata.imports) metadata.imports = [...imports, ...metadata.imports]
  if (!metadata.imports) metadata.imports = imports

  const ref = await createTestingModule(metadata, provider, value)
  const app = await useGlobal(ref.createNestApplication())

  await ref.get(Sequelize).sync({ force: true })

  return { app, ref }
}

export default createApp
