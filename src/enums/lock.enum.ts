/**
 * @file Enums - LOCK
 * @module sneusers/enums/LOCK
 */

/**
 * Possible options for row locking. Used in conjunction with `find` calls.
 *
 * @enum {Uppercase<string>}
 */
enum LOCK {
  KEY_SHARE = 'KEY SHARE',
  NO_KEY_UPDATE = 'NO KEY UPDATE',
  SHARE = 'SHARE',
  UPDATE = 'UPDATE'
}

export default LOCK
