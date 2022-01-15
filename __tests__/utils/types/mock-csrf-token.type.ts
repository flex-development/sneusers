/**
 * @file Global Test Types - MockCsrfToken
 * @module tests/utils/types/MockCsrfToken
 */

/**
 * Object containing a csrf secret and token.
 */
type MockCsrfToken = {
  _csrf: string
  csrf_token: string
}

export default MockCsrfToken
