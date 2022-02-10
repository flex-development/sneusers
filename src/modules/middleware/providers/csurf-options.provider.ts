import { FactoryProvider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CookieOptionsFactory, CsurfOptionsFactory } from '@sneusers/factories'
import { EnvironmentVariables } from '@sneusers/models'
import { CsurfConfigService } from '@sneusers/providers'

/**
 * @file MiddlewareModule Providers - CsurfOptionsProvider
 * @module sneusers/modules/middleware/providers/CsurfOptionsProvider
 */

/**
 * Creates a {@link CsurfOptionsFactory} provider.
 *
 * @return {FactoryProvider<CsurfOptionsFactory>} Factory provider
 */
const CsurfOptionsProvider = (): FactoryProvider<CsurfOptionsFactory> => {
  return {
    inject: [ConfigService, CookieOptionsFactory],
    provide: CsurfOptionsFactory,
    useFactory: (
      config: ConfigService<EnvironmentVariables, true>,
      cookie: CookieOptionsFactory
    ): CsurfOptionsFactory => new CsurfConfigService(config, cookie)
  }
}

export default CsurfOptionsProvider
