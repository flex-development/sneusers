import type { OrUndefined } from '@flex-development/tutils'
import type { SameSitePolicy } from '../enums'

/**
 * @file MiddlewareModule Type Definitions - SameSite
 * @module sneusers/modules/middleware/types/SameSite
 */

/**
 * Cookie `sameSite` option types.
 *
 * @see https://github.com/expressjs/csurf#cookie
 * @see https://github.com/expressjs/session#cookiesamesite
 */
type SameSite = OrUndefined<SameSitePolicy | boolean>

export default SameSite
