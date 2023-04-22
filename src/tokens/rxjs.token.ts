/**
 * @file Injection Tokens - RXJS
 * @module sneusers/tokens/RXJS
 */

import type { InjectionToken } from '@nestjs/common'

/**
 * [`rxjs`][1] dependency injection token.
 *
 * [1]: https://rxjs.dev/
 *
 * @const {Extract<InjectionToken,symbol>} RXJS
 */
const RXJS: Extract<InjectionToken, symbol> = Symbol('rxjs')

export default RXJS
