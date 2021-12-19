import type { SequelizeModuleOptions } from '@nestjs/sequelize'
import { SequelizeModule } from '@nestjs/sequelize'
import { ENV } from '@sneusers/config/configuration'

/**
 * @file Modules - DatabaseModule
 * @module sneusers/modules/DatabaseModule
 * @see https://docs.nestjs.com/techniques/database#sequelize-integration
 */

const options: SequelizeModuleOptions = {
  autoLoadModels: ENV.DB_AUTO_LOAD_MODELS,
  database: ENV.DB_NAME,
  define: {
    createdAt: 'created_at',
    defaultScope: { order: [['id', 'ASC']] },
    deletedAt: 'deleted_at',
    omitNull: false,
    timestamps: true,
    underscored: true,
    updatedAt: 'updated_at'
  },
  dialect: ENV.PROD ? 'mysql' : 'sqlite',
  dialectOptions: { dateStrings: true },
  host: ENV.PROD ? ENV.DB_HOST : undefined,
  logQueryParameters: ENV.DB_LOG_QUERY_PARAMS,
  logging: ENV.DB_LOGGING,
  name: ENV.NODE_ENV,
  omitNull: false,
  password: ENV.PROD ? ENV.DB_PASSWORD : undefined,
  port: ENV.PROD ? ENV.DB_PORT : undefined,
  query: { nest: true, raw: false },
  repositoryMode: true,
  retryAttempts: 3,
  retryDelay: 0,
  storage: `./db/${ENV.DB_NAME}_${ENV.NODE_ENV}.db`,
  synchronize: ENV.DB_AUTO_LOAD_MODELS,
  typeValidation: true,
  username: ENV.PROD ? ENV.DB_USERNAME : undefined
}

if (ENV.PROD) options.timezone = ENV.DB_TIMEZONE

export default SequelizeModule.forRoot(options)
