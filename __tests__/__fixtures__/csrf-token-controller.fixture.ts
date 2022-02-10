import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { CsrfToken } from '@sneusers/decorators'

/**
 * @file Global Test Fixture - CsrfTokenController
 * @module tests/fixtures/CsrfTokenController
 */

@Controller('csrf-token')
class CsrfTokenController {
  @Get()
  @HttpCode(HttpStatus.OK)
  token(@CsrfToken('create') csrf_token: string): string {
    return csrf_token
  }
}

export default CsrfTokenController
