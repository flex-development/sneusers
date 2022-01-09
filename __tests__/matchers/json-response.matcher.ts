import { HttpStatus } from '@nestjs/common'
import { ExceptionCode } from '@sneusers/enums'
import { Response } from 'supertest'

/**
 * @file Custom Matchers - jsonResponse
 * @module tests/config/jsonResponse
 */

/**
 * Checks if a {@link Response} contains JSON content.
 *
 * The {@link Response#body} type and {@link Response#status} can be verified as
 * well. Response bodies are expected to be an array or object.
 *
 * @see https://github.com/visionmedia/supertest
 *
 * [1]: https://www.chaijs.com/api
 * [2]: https://www.chaijs.com/api/plugins
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
      const res: Response = utils.flag(this, 'object')

      const body = res.body
      const content_type = res.headers['content-type']
      const status = res.status

      const mp = 'expected response'
      const message_body = `${mp} body to be an ${ebody}`
      const message_match = `${mp} content-type ${content_type} to match /json/`
      const message_status = `${mp} status ${status} to equal ${estatus}`

      new chai.Assertion(status).to.equal(estatus, message_status)
      new chai.Assertion(content_type).to.match(/json/, message_match)
      ebody && new chai.Assertion(body).to.be.an(ebody, message_body)

      return this
    }
  )
}

export default jsonResponse
