/**
 * @file Test Utilities - stub500
 * @module tests/utils/stub500
 */

/**
 * Create an object with a method named `method` that throws an error.
 *
 * @this {void}
 *
 * @param {string} url
 *  The endpoint being tested
 * @param {string} method
 *  The name of the method to stub
 * @return {Record<string, (this: void) => never>}
 *  Object with `method` stub
 */
function stub500(
  this: void,
  url: string,
  method: string
): Record<string, (this: void) => never> {
  return {
    /**
     * @this {void}
     *
     * @return {never}
     *  Never
     * @throws {Error}
     */
    [method](this: void): never {
      throw new Error(url)
    }
  }
}

export default stub500
