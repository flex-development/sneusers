/**
 * @file Errors - Reason
 * @module sneusers/errors/Reason
 */

import type { JsonObject } from '@flex-development/sneusers/types'

/**
 * The reason for an exception.
 *
 * @class
 * @abstract
 */
abstract class Reason {
  /**
   * Get a JSON representation of the exception reason.
   *
   * @public
   * @instance
   * @abstract
   *
   * @return {JsonObject}
   *  JSON representation of `this` exception reason
   */
  public abstract toJSON(): JsonObject
}

export default Reason
