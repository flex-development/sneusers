import cookie from 'cookie'

/**
 * @file Global Test Utilities - getCsrfToken
 * @module tests/utils/getCsrfToken
 */

/**
 * Retrieves a csrf secret and token.
 *
 * Requires the `CsrfTokenController` to be initialized.
 *
 * @async
 * @param {ChaiHttp.Agent} req - Incoming request
 * @return {Promise<{ _csrf: string; csrf_token: string }>} csrf secret + token
 */
const getCsrfToken = async (
  req: ChaiHttp.Agent
): Promise<{ _csrf: string; csrf_token: string }> => {
  const res = await req.get('/csrf-token')

  return {
    _csrf: cookie.parse(res.header['set-cookie'][0])._csrf,
    csrf_token: res.text
  }
}

export default getCsrfToken
