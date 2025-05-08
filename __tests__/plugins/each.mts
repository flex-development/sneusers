/**
 * @file Plugins - each
 * @module tests/plugins/each
 */

export default plugin

/**
 * @template {any} [T=unknown]
 *  List item type
 */
type List<T = unknown> = Set<T> | readonly T[]

/**
 * @see {@linkcode Chai.ChaiStatic}
 * @see {@linkcode Chai.ChaiUtils}
 *
 * @param {ChaiStatic} chai
 *  `chai` export
 * @param {Chai.ChaiUtils} utils
 *  `chai` utilities
 * @return {undefined}
 */
function plugin(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): undefined {
  return void chai.Assertion.addProperty('each', each)

  /**
   * @this {Chai.AssertionStatic}
   *
   * @return {undefined}
   */
  function each(this: Chai.AssertionStatic): undefined {
    /**
     * Subject of assertion.
     *
     * @const {unknown} object
     */
    const object: unknown = utils.flag(this, 'object')

    new chai.Assertion(object).satisfies(list)

    for (const item of object as List) {
      /**
       * Assertion for list item.
       *
       * @const {Chai.Assertion} that
       */
      const that: Chai.Assertion = Object.create(this)

      utils.transferFlags(this as unknown as Chai.Assertion, that, false)
      utils.flag(that, 'object', item)

      new chai.Assertion(that)
    }

    return void undefined
  }

  /**
   * @this {void}
   *
   * @param {unknown} thing
   *  The value to check
   * @return {thing is List}
   *  `true` if `thing` is an array or set
   */
  function list(this: void, thing: unknown): thing is List {
    return Array.isArray(thing) || thing instanceof Set
  }
}
