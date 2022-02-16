import { HttpStatus } from '@nestjs/common'
import { ApiEndpoint } from '@sneusers/enums'
import { UserDTO } from '@sneusers/subdomains/users/dtos'
import { RequestGitHubAuthDTO } from '../../dtos'

/**
 * @file Controllers - AuthController OpenAPI Documentation
 * @module sneusers/subdomains/auth/controllers/openapi/Auth
 */

export default {
  controller: ApiEndpoint.OAUTH,
  tags: [ApiEndpoint.AUTH, ApiEndpoint.USERS],
  github: {
    path: 'github',
    status: HttpStatus.PERMANENT_REDIRECT
  },
  githubCallback: {
    path: 'github/callback',
    status: HttpStatus.OK,
    query: { type: RequestGitHubAuthDTO },
    responses: {
      200: { description: 'Authenticated GitHub user', type: UserDTO }
    }
  }
}
