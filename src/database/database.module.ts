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
import { MongoDriver } from '@mikro-orm/mongodb'
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
         * Database hostname.
         *
         * @const {string} DB_HOSTNAME
         */
        const DB_HOSTNAME: string = config.get<string>('DB_HOSTNAME')

        /**
         * Boolean indicating if database is deployed via MongoDB Atlas.
         *
         * @const {boolean} MONGODB_ATLAS
         */
        const MONGODB_ATLAS: boolean = DB_HOSTNAME.endsWith('mongodb.net')

        /**
         * Test environment check.
         *
         * @const {boolean} TEST
         */
        const TEST: boolean = config.get<NodeEnv>('NODE_ENV') === NodeEnv.TEST

        return {
          allowGlobalContext: false,
          autoLoadEntities: true,
          clientUrl: template('mongodb{{0}}://{{1}}:{{2}}@{{3}}:{{4}}/', {
            0: MONGODB_ATLAS ? '+srv' : '',
            1: config.get<string>('DB_USERNAME'),
            2: config.get<string>('DB_PASSWORD'),
            3: DB_HOSTNAME,
            4: MONGODB_ATLAS ? '' : config.get<number>('DB_PORT')
          }).replace(/:\/$/, '/'),
          connect: !TEST,
          dbName: config.get<string>('DB_NAME'),
          debug: !TEST,
          discovery: {
            alwaysAnalyseProperties: false,
            requireEntitiesArray: true,
            warnWhenNoEntities: false
          },
          driver: MongoDriver,
          ensureDatabase: true,
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
          persistOnCreate: true,
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
