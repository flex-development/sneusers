import { ClassProvider } from '@nestjs/common'
import { HelmetOptionsFactory } from '@sneusers/factories'
import { HelmetConfigService } from '@sneusers/providers'

/**
 * @file MiddlewareModule Providers - HelmetOptionsProvider
 * @module sneusers/modules/middleware/providers/HelmetOptionsProvider
 */

/**
 * Creates a {@link HelmetOptionsFactory} provider.
 *
 * @return {ClassProvider<HelmetOptionsFactory>} Class provider
 */
const HelmetOptionsProvider = (): ClassProvider<HelmetOptionsFactory> => {
  return { provide: HelmetOptionsFactory, useClass: HelmetConfigService }
}

export default HelmetOptionsProvider
