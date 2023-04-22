/**
 * @file Providers - RxJSProvider
 * @module sneusers/providers/RxJSProvider
 */

import { RXJS } from '#src/tokens'
import type { ValueProvider } from '@nestjs/common'
import type * as RxJS from 'rxjs'
import * as rxjs from 'rxjs'

/**
 * [`rxjs`][1] dependency provider.
 *
 * [1]: https://rxjs.dev/
 *
 * @const {ValueProvider<typeof RxJS>} RxJSProvider
 */
const RxJSProvider: ValueProvider<typeof RxJS> = {
  provide: RXJS,
  useValue: rxjs
}

export default RxJSProvider
