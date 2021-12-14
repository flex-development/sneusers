import { ConfigModule } from '@nestjs/config'
import configuration, {
  ENV,
  ENV_FILE_PATH as envFilePath,
  validate
} from '@sneusers/config/configuration'

/**
 * @file Modules - ConfigModule
 * @module sneusers/modules/ConfigModule
 * @see https://docs.nestjs.com/techniques/configuration
 */

export default ConfigModule.forRoot({
  cache: ENV.PROD,
  envFilePath,
  expandVariables: true,
  ignoreEnvFile: false,
  ignoreEnvVars: false,
  isGlobal: true,
  load: [configuration],
  validate
})
