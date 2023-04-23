/**
 * @file Database - DatabaseModule
 * @module sneusers/database/DatabaseModule
 */

import type { IConfig } from '#src/interfaces'
import * as pathe from '@flex-development/pathe'
import { NodeEnv } from '@flex-development/tutils'
import {
  ReflectMetadataProvider,
  UnderscoreNamingStrategy
} from '@mikro-orm/core'
import { MikroOrmModule, type MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { template } from 'radash'

/**
 * Database module.
 *
 * Database driver: MongoDB
 *
 * @see https://docs.nestjs.com/recipes/mikroorm
 * @see https://mikro-orm.io
 *
 * @class
 */
@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (
        config: ConfigService<IConfig, true>
      ): Omit<MikroOrmModuleOptions, 'contextName'> => {
        /**
         * Test environment check.
         *
         * @const {boolean} TEST
         */
        const TEST: boolean = config.get<NodeEnv>('NODE_ENV') === NodeEnv.TEST

        return {
          allowGlobalContext: false,
          autoLoadEntities: true,
          clientUrl: template('mongodb://{{0}}:{{1}}@{{2}}:{{3}}/', {
            0: config.get<string>('DB_USERNAME'),
            1: config.get<string>('DB_PASSWORD'),
            2: config.get<string>('DB_HOSTNAME'),
            3: config.get<number>('DB_PORT')
          }),
          connect: !TEST,
          dbName: config.get<string>('DB_NAME'),
          debug: !TEST,
          discovery: {
            alwaysAnalyseProperties: false,
            requireEntitiesArray: true,
            warnWhenNoEntities: false
          },
          ensureDatabase: false,
          ensureIndexes: false,
          forceEntityConstructor: true,
          forceUndefined: false,
          forceUtcTimezone: true,
          metadataProvider: ReflectMetadataProvider,
          migrations: {
            allOrNothing: true,
            disableForeignKeys: true,
            dropTables: true,
            emit: 'ts',
            glob: '!(*.d).ts',
            path: pathe.resolve('dist/database/migrations'),
            pathTs: pathe.resolve('src/database/migrations'),
            safe: false,
            snapshot: true,
            tableName: 'migrations',
            transactional: true
          },
          namingStrategy: UnderscoreNamingStrategy,
          password: config.get<string>('DB_PASSWORD'),
          persistOnCreate: false,
          seeder: {
            path: pathe.resolve('dist/database/seeders'),
            pathTs: pathe.resolve('src/database/seeders')
          },
          strict: true,
          tsNode: true,
          type: 'mongo',
          user: config.get<string>('DB_USERNAME'),
          validate: true,
          validateRequired: true
        }
      }
    })
  ]
})
class DatabaseModule {}

export default DatabaseModule
