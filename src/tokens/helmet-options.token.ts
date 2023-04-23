/**
 * @file Injection Tokens - HELMET_OPTIONS
 * @module sneusers/tokens/HELMET_OPTIONS
 */

import type { InjectionToken } from '@nestjs/common'

/**
 * [`helmet`][1] options injection token.
 *
 * [1]: https://github.com/helmetjs/helmet
 *
 * @const {Extract<InjectionToken,symbol>} HELMET_OPTIONS
 */
const HELMET_OPTIONS: Extract<InjectionToken, symbol> = Symbol('HelmetOptions')

export default HELMET_OPTIONS
