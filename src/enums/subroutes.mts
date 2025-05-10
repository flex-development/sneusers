/**
 * @file Enums - subroutes
 * @module sneusers/enums/subroutes
 */

/**
 * API sub routes.
 *
 * @enum {string}
 */
const enum subroutes {
  ACCOUNTS_CREATE = '',
  ACCOUNTS_UID = '/:uid',
  ACCOUNTS_WHOAMI = '/whoami'
}

export default subroutes
