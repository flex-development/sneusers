import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import CsrfToken from '@sneusers/decorators/csrf-token.decorator'

/**
 * @file Fixtures - CsrfTokenController
 * @module fixtures/CsrfTokenController
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
