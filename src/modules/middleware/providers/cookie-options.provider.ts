import { ClassProvider } from '@nestjs/common'
import { CookieOptionsFactory } from '@sneusers/factories'
import { CookieConfigService } from '@sneusers/providers'

/**
 * @file MiddlewareModule Providers - CookieOptionsProvider
 * @module sneusers/modules/middleware/providers/CookieOptionsProvider
 */

/**
 * Creates a {@link CookieOptionsFactory} provider.
 *
 * @return {ClassProvider<CookieOptionsFactory>} Class provider
 */
const CookieOptionsProvider = (): ClassProvider<CookieOptionsFactory> => {
  return { provide: CookieOptionsFactory, useClass: CookieConfigService }
}

export default CookieOptionsProvider
