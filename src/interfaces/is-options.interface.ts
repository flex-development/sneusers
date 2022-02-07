import type { ValidationOptions } from 'class-validator'

/**
 * @file Interfaces - IsOptions
 * @module sneusers/interfaces/IsOptions
 */

/**
 * `Is` decorator options.
 *
 * @extends ValidationOptions
 */
interface IsOptions extends ValidationOptions {
  /**
   * List of allowed types.
   *
   * See [`@sindresorhus/is`][1] for a list of checkable types.
   *
   * [1]: https://github.com/sindresorhus/is
   *
   * @default []
   */
  types?: string[]
}

export default IsOptions
