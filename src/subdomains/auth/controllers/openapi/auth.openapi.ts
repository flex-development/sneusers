import { HttpStatus } from '@nestjs/common'
import { Exception } from '@sneusers/exceptions'
import { UserDTO } from '@sneusers/subdomains/users/dtos'

/**
 * @file Controllers - Auth OpenAPI Documentation
 * @module sneusers/subdomains/auth/controllers/openapi/Auth
 */

export default {
  controller: 'auth',
  tags: ['auth', 'users'],
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
