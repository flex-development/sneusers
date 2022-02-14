/**
 * @file MiddlewareModule Enums - SessionUnset
 * @module sneusers/modules/middleware/enums/SessionUnset
 */

/**
 * Control the result of unsetting `req.session`,
 *
 * @see https://github.com/expressjs/session#unset
 *
 * @enum {Lowercase<string>}
 */
enum SessionUnset {
  DESTROY = 'destroy',
  KEEP = 'keep'
}

export default SessionUnset
