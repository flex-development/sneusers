import { HttpStatus } from '@nestjs/common'
import { Exception } from '@sneusers/exceptions'
import { QueryParams } from '@sneusers/models'
import { UserDTO } from '@sneusers/subdomains/users/dtos'

/**
 * @file Controllers - Users OpenAPI Documentation
 * @module sneusers/subdomains/users/controllers/openapi/Users
 */

export default {
  controller: 'users',
  tags: ['users'],
  delete: {
    status: HttpStatus.OK,
    responses: {
      204: { description: 'Deleted user', type: Boolean },
      404: { description: 'User not found', type: Exception },
      500: { description: 'Internal server error', type: Exception },
      502: { description: 'Nginx reverse proxy failure', type: String }
    }
  },
  find: {
    status: HttpStatus.OK,
    query: { type: QueryParams },
    responses: {
      200: { description: 'Executed search' },
      400: { description: 'query validation failure', type: Exception },
      500: { description: 'Internal server error', type: Exception },
      502: { description: 'Nginx reverse proxy failure', type: String }
    }
  },
  findOne: {
    status: HttpStatus.OK,
    query: { type: QueryParams },
    responses: {
      200: { description: 'Found user', type: UserDTO },
      400: { description: 'query validation failure', type: Exception },
      404: { description: 'User not found', type: Exception },
      500: { description: 'Internal server error', type: Exception },
      502: { description: 'Nginx reverse proxy failure', type: String }
    }
  },
  patch: {
    status: HttpStatus.OK,
    responses: {
      200: { description: 'Updated user', type: UserDTO },
      400: { description: 'body or query validation failure', type: Exception },
      404: { description: 'User not found', type: Exception },
      409: { description: 'Email address is not unique', type: Exception },
      500: { description: 'Internal server error', type: Exception },
      502: { description: 'Nginx reverse proxy failure', type: String }
    }
  }
}
