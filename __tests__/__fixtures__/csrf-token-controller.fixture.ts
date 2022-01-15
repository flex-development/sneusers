import { Controller, Global, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CsrfToken } from '@sneusers/subdomains/auth/decorators'

/**
 * @file Global Test Fixture - CsrfTokenController
 * @module tests/fixtures/CsrfTokenController
 */

@Global()
@Controller('csrf-token')
class CsrfTokenController {
  @Post()
  @HttpCode(HttpStatus.OK)
  get(@CsrfToken('create') csrf_token: string): { csrf_token: string } {
    return { csrf_token }
  }
}

export default CsrfTokenController
