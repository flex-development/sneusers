import { HttpStatus } from '@nestjs/common'
import { ApiEndpoint } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import {
  LoginDTO,
  RequestLoginDTO,
  RequestVerifDTO,
  RequestVerifResendDTO
} from '@sneusers/subdomains/auth/dtos'
import { UserDTO, UserEmailSentDTO } from '@sneusers/subdomains/users/dtos'

/**
 * @file Controllers - Auth OpenAPI Documentation
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
      401: { description: 'Invalid login credentials', type: Exception },
      500: { description: 'Internal server error', type: Exception },
      502: { description: 'Nginx reverse proxy failure', type: String }
    }
  },
  logout: {
    path: 'logout',
    status: HttpStatus.OK,
    responses: {
      200: { description: 'Logged out user', type: UserDTO },
      500: { description: 'Internal server error', type: Exception },
      502: { description: 'Nginx reverse proxy failure', type: String }
    }
  },
  refresh: {
    path: 'refresh',
    status: HttpStatus.OK,
    responses: {
      200: { description: 'Updated refresh token', type: LoginDTO },
      401: { description: 'Unauthorized', type: Exception },
      500: { description: 'Internal server error', type: Exception },
      502: { description: 'Nginx reverse proxy failure', type: String }
    }
  },
  register: {
    path: 'register',
    status: HttpStatus.CREATED,
    responses: {
      201: { description: 'Registered new user', type: UserDTO },
      409: { description: 'Email address is not unique', type: Exception },
      422: { description: 'Password hashing failure', type: Exception },
      500: { description: 'Internal server error', type: Exception },
      502: { description: 'Nginx reverse proxy failure', type: String }
    }
  },
  resendVerification: {
    path: 'verify/resend',
    status: HttpStatus.OK,
    query: { type: RequestVerifResendDTO },
    responses: {
      200: { description: 'Resent verification', type: UserEmailSentDTO },
      403: { description: 'Invalid verification type', type: Exception },
      500: { description: 'Internal server error', type: Exception },
      502: { description: 'Nginx reverse proxy failure', type: String }
    }
  },
  verify: {
    path: 'verify',
    status: HttpStatus.OK,
    query: { type: RequestVerifDTO },
    responses: {
      200: { description: 'Successful verification', type: UserDTO },
      401: { description: 'Unauthorized', type: Exception },
      403: { description: 'Invalid verification type', type: Exception },
      500: { description: 'Internal server error', type: Exception },
      502: { description: 'Nginx reverse proxy failure', type: String }
    }
  }
}
