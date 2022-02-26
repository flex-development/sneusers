import { HttpStatus } from '@nestjs/common'
import { getSchemaPath } from '@nestjs/swagger'
import { ApiEndpoint } from '@sneusers/enums'
import { UserDTO } from '@sneusers/subdomains/users/dtos'
import { RequestGitHubAuthDTO, RequestGoogleAuthDTO } from '../../dtos'

/**
 * @file Controllers - AuthController OpenAPI Documentation
 * @module sneusers/subdomains/auth/controllers/openapi/Auth
 */

export default {
  controller: ApiEndpoint.OAUTH,
  tags: [ApiEndpoint.AUTH, ApiEndpoint.USERS],
  extraModels: [RequestGitHubAuthDTO, RequestGoogleAuthDTO],
  provider: {
    path: ':provider',
    status: HttpStatus.PERMANENT_REDIRECT
  },
  providerCallback: {
    path: ':provider/callback',
    status: HttpStatus.OK,
    query: {
      schema: {
        oneOf: [
          { $ref: getSchemaPath(RequestGitHubAuthDTO) },
          { $ref: getSchemaPath(RequestGoogleAuthDTO) }
        ]
      }
    },
    responses: {
      200: { description: 'Authenticated user', type: UserDTO }
    }
  }
}
