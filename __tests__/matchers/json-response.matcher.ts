import { ExceptionCode } from '@flex-development/exceptions/enums'
import { HttpStatus } from '@nestjs/common'

/**
 * @file Custom Matchers - jsonResponse
 * @module tests/config/matchers/jsonResponse
 */

/**
 * Checks if a {@link ChaiHttp.Response} contains JSON content.
 *
 * The response body type and status can be verified as well. Response bodies
 * are expected to be an array or object.
 *
 * [1]: https://www.chaijs.com/api
 * [2]: https://www.chaijs.com/api/plugins
 *
 * @see https://github.com/visionmedia/superagent
 * @see https://github.com/chaijs/chai-http#assertions
 *
 * @param {Chai.ChaiStatic} chai - [`chai`][1] module
 * @param {Chai.ChaiUtils} utils - [Plugin utilities][2]
 * @return {void} Nothing when complete
 */
const jsonResponse = (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void => {
  return utils.addMethod(
    chai.Assertion.prototype,
    jsonResponse.name,
    function (
      this: Chai.Assertion,
      estatus: HttpStatus | ExceptionCode = HttpStatus.OK,
      ebody?: 'array' | 'object'
    ): Chai.Assertion {
      const res: ChaiHttp.Response = utils.flag(this, 'object')
      const message_body = `expected response body to be an ${ebody}`

      new chai.Assertion(res).to.have.status(estatus)
      new chai.Assertion(res).to.be.json
      ebody && new chai.Assertion(res.body).to.be.an(ebody, message_body)

      return this
    }
  )
}

export default jsonResponse
