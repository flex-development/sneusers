import { HttpStatus } from '@nestjs/common'
import { ApiEndpoint } from '@sneusers/enums'

/**
 * @file Controllers - HealthController OpenAPI Documentation
 * @module sneusers/controllers/openapi/Health
 */

export default {
  controller: ApiEndpoint.HEALTH,
  tags: [ApiEndpoint.HEALTH],
  get: {
    path: undefined,
    status: HttpStatus.OK,
    responses: {}
  }
}
