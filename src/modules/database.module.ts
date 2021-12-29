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
  dialect: 'mysql',
  dialectOptions: { dateStrings: true },
  host: ENV.DB_HOST,
  logQueryParameters: ENV.DB_LOG_QUERY_PARAMS,
  logging: ENV.DB_LOGGING,
  name: ENV.NODE_ENV,
  omitNull: false,
  password: ENV.DB_PASSWORD,
  port: ENV.DB_PORT,
  query: { nest: true, raw: false },
  repositoryMode: true,
  retryAttempts: 3,
  retryDelay: 0,
  synchronize: ENV.DB_AUTO_LOAD_MODELS,
  timezone: ENV.DB_TIMEZONE,
  typeValidation: true,
  username: ENV.DB_USERNAME
}

export default SequelizeModule.forRoot(options)
