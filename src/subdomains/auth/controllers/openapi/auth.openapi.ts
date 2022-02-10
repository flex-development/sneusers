import { HttpStatus } from '@nestjs/common'
import { ApiEndpoint } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import {
  LoginDTO,
  RegisterUserDTO,
  RequestLoginDTO,
  WhoamiDTO
} from '@sneusers/subdomains/auth/dtos'
import { UserDTO } from '@sneusers/subdomains/users/dtos'

/**
 * @file Controllers - AuthController OpenAPI Documentation
 * @module sneusers/subdomains/auth/controllers/openapi/Auth
 */

export default {
  controller: ApiEndpoint.AUTH,
  tags: [ApiEndpoint.AUTH, ApiEndpoint.USERS],
  login: {
    path: 'login',
    status: HttpStatus.OK,
    body: { type: RequestLoginDTO },
    responses: {
      200: { description: 'Logged in user', type: LoginDTO },
      401: { description: 'Invalid login credentials', type: Exception }
    }
  },
  logout: {
    path: 'logout',
    status: HttpStatus.OK,
    responses: {
      200: { description: 'Logged out user', type: UserDTO }
    }
  },
  refresh: {
    path: 'refresh',
    status: HttpStatus.OK,
    responses: {
      200: { description: 'Issued new access token', type: LoginDTO },
      401: { description: 'Unauthorized', type: Exception }
    }
  },
  register: {
    path: 'register',
    status: HttpStatus.CREATED,
    body: { type: RegisterUserDTO },
    responses: {
      201: { description: 'Registered new user', type: UserDTO },
      409: { description: 'Email address is not unique', type: Exception },
      422: { description: 'Password hashing failure', type: Exception }
    }
  },
  whoami: {
    path: 'whoami',
    status: HttpStatus.OK,
    responses: {
      200: { description: 'Completed identification request', type: WhoamiDTO }
    }
  }
}
