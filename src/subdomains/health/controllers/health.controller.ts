/**
 * @file Controllers - HealthController
 * @module sneusers/subdomains/health/controllers/Health
 */

import { Endpoint, Subdomain } from '#src/enums'
import { Controller, Get, HttpStatus, Inject } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags
} from '@nestjs/swagger'
import {
  HealthCheckService,
  HttpHealthIndicator,
  MikroOrmHealthIndicator,
  type HealthCheckResult
} from '@nestjs/terminus'
import { getHealthCheckSchema } from '@nestjs/terminus/dist/health-check/health-check.schema'

/**
 * Health check controller.
 *
 * @see https://docs.nestjs.com/recipes/terminus
 *
 * @class
 */
@Controller(Endpoint.HEALTH)
@ApiTags(Subdomain.HEALTH)
class HealthController {
  /**
   * Creates a new health check controller.
   *
   * @param {HealthCheckService} health - Health check service
   * @param {HttpHealthIndicator} http - HTTP health indicator
   * @param {MikroOrmHealthIndicator} mikro - MikroORM health indicator
   */
  constructor(
    @Inject(HealthCheckService)
    private readonly health: HealthCheckService,
    @Inject(HttpHealthIndicator)
    private readonly http: HttpHealthIndicator,
    @Inject(MikroOrmHealthIndicator)
    private readonly mikro: MikroOrmHealthIndicator
  ) {}

  /**
   * Health check generator.
   *
   * @public
   * @async
   *
   * @return {Promise<HealthCheckResult>} Health check result
   */
  @Get()
  @ApiOkResponse({
    description: 'Health check successful',
    schema: getHealthCheckSchema('ok'),
    status: HttpStatus.OK
  })
  @ApiServiceUnavailableResponse({
    description: 'Health check failed',
    schema: getHealthCheckSchema('error'),
    status: HttpStatus.SERVICE_UNAVAILABLE
  })
  public async get(): Promise<HealthCheckResult> {
    return this.health.check([
      async () => this.mikro.pingCheck(Subdomain.DATABASE),
      async () => this.http.pingCheck(Subdomain.DOCS, Endpoint.DOCS)
    ])
  }
}

export default HealthController
