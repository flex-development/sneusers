import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration, { envFilePath } from '@sneusers/config/configuration'

/**
 * @file Modules - AppModule
 * @module sneusers/modules/AppModule
 * @see https://docs.nestjs.com/modules
 */

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: configuration().PROD,
      envFilePath,
      expandVariables: true,
      ignoreEnvFile: false,
      ignoreEnvVars: false,
      isGlobal: true,
      load: [configuration]
    })
  ],
  providers: []
})
export default class AppModule {}
