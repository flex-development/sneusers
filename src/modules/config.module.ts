import { ConfigModule } from '@nestjs/config'
import configuration, {
  CONF,
  envFilePath
} from '@sneusers/config/configuration'

/**
 * @file Modules - ConfigModule
 * @module sneusers/modules/ConfigModule
 * @see https://docs.nestjs.com/techniques/configuration
 */

export default ConfigModule.forRoot({
  cache: CONF.PROD,
  envFilePath,
  expandVariables: true,
  ignoreEnvFile: false,
  ignoreEnvVars: false,
  isGlobal: true,
  load: [configuration]
})
