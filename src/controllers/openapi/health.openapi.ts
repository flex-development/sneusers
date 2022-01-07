import { HttpStatus } from '@nestjs/common'
import { ApiEndpoint } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'

/**
 * @file Controllers - Health OpenAPI Documentation
 * @module sneusers/controllers/openapi/Health
 */

export default {
  controller: ApiEndpoint.HEALTH,
  tags: [ApiEndpoint.HEALTH],
  get: {
    status: HttpStatus.OK,
    responses: {
      500: { description: 'Internal server error', type: Exception },
      502: { description: 'Nginx reverse proxy failure', type: String }
    }
  }
}
