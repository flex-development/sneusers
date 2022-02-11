import { HttpStatus } from '@nestjs/common'
import { ApiEndpoint } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { UserDTO, UserEmailSentDTO } from '@sneusers/subdomains/users/dtos'
import { RequestVerifDTO, RequestVerifResendDTO } from '../../dtos'

/**
 * @file Controllers - VerificationController OpenAPI Documentation
 * @module sneusers/subdomains/auth/controllers/openapi/Verification
 */

export default {
  controller: ApiEndpoint.VERIFY,
  tags: [ApiEndpoint.AUTH, ApiEndpoint.USERS],
  resend: {
    path: 'resend',
    status: HttpStatus.OK,
    query: { type: RequestVerifResendDTO },
    responses: {
      200: { description: 'Resent verification', type: UserEmailSentDTO },
      403: { description: 'Invalid verification type', type: Exception }
    }
  },
  verify: {
    path: undefined,
    status: HttpStatus.OK,
    query: { type: RequestVerifDTO },
    responses: {
      200: { description: 'Successful verification', type: UserDTO },
      401: { description: 'Unauthorized', type: Exception },
      403: { description: 'Invalid verification type', type: Exception }
    }
  }
}
