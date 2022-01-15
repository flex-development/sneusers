import { HttpStatus } from '@nestjs/common'
import { Exception } from '@sneusers/exceptions'
import { LoginDTO, LoginRequestDTO } from '@sneusers/subdomains/auth/dtos'
import { UserDTO } from '@sneusers/subdomains/users/dtos'

/**
 * @file Controllers - Auth OpenAPI Documentation
 * @module sneusers/subdomains/auth/controllers/openapi/Auth
 */

export default {
  controller: 'auth',
  tags: ['auth', 'users'],
  login: {
    path: 'login',
    status: HttpStatus.OK,
    body: { type: LoginRequestDTO },
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
  }
}
