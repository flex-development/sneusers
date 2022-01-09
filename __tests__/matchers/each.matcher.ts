/**
 * @file Custom Matchers - each
 * @module tests/config/each
 */

/**
 * Wraps each item in an array in a {@link chai.Assertion}.
 *
 * [1]: https://www.chaijs.com/api
 * [2]: https://www.chaijs.com/api/plugins
 *
 * @param {Chai.ChaiStatic} chai - [`chai`][1] module
 * @param {Chai.ChaiUtils} utils - [Plugin utilities][2]
 * @return {void} Nothing when complete
 */
const each = (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void => {
  return utils.addMethod(
    chai.Assertion.prototype,
    each.name,
    function (
      this: Chai.Assertion,
      fn: (item: Chai.Assertion) => any
    ): Chai.Assertion {
      for (const t of utils.flag(this, 'object')) fn(new chai.Assertion(t))
      return this
    }
  )
}

export default each
