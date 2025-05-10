/**
 * @file Test Utilities - stub500
 * @module tests/utils/stub500
 */

/**
 * Create a function that throws an error.
 *
 * @this {void}
 *
 * @param {string} url
 *  The endpoint being tested
 * @return {(this: void) => never}
 *  Error stub
 */
function stub500(this: void, url: string): (this: void) => never {
  return stub

  /**
   * @this {void}
   *
   * @return {never}
   *  Never
   * @throws {Error}
   */
  function stub(this: void): never {
    throw new Error(url)
  }
}

export default stub500
