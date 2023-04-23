/**
 * @file Providers - HelmetOptionsProvider
 * @module sneusers/providers/HelmetOptionsProvider
 */

import { HELMET_OPTIONS } from '#src/tokens'
import type { ValueProvider } from '@nestjs/common'
import type { HelmetOptions } from 'helmet'

/**
 * [`helmet`][1] options provider.
 *
 * [1]: https://github.com/helmetjs/helmet
 *
 * @const {ValueProvider<HelmetOptions>} HelmetOptionsProvider
 */
const HelmetOptionsProvider: ValueProvider<HelmetOptions> = {
  provide: HELMET_OPTIONS,
  useValue: {
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true
  }
}

export default HelmetOptionsProvider
