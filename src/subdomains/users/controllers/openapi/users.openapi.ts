import { HttpStatus } from '@nestjs/common'
import { ApiEndpoint } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { QueryParams } from '@sneusers/models'
import { UserDTO } from '@sneusers/subdomains/users/dtos'

/**
 * @file Controllers - UsersController OpenAPI Documentation
 * @module sneusers/subdomains/users/controllers/openapi/Users
 */

export default {
  controller: ApiEndpoint.USERS,
  tags: [ApiEndpoint.USERS],
  delete: {
    path: ':uid',
    status: HttpStatus.OK,
    responses: {
      204: { description: 'Deleted user', type: Boolean },
      404: { description: 'User not found', type: Exception }
    }
  },
  find: {
    path: undefined,
    status: HttpStatus.OK,
    query: { type: QueryParams },
    responses: {
      200: { description: 'Executed search' },
      400: { description: 'query validation failure', type: Exception }
    }
  },
  findOne: {
    path: ':uid',
    status: HttpStatus.OK,
    query: { type: QueryParams },
    responses: {
      200: { description: 'Found user', type: UserDTO },
      400: { description: 'query validation failure', type: Exception },
      404: { description: 'User not found', type: Exception }
    }
  },
  patch: {
    path: ':uid',
    status: HttpStatus.OK,
    responses: {
      200: { description: 'Updated user', type: UserDTO },
      400: { description: 'body or query validation failure', type: Exception },
      404: { description: 'User not found', type: Exception },
      409: { description: 'Email address is not unique', type: Exception }
    }
  }
}
