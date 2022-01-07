import { Controller, Get, HttpCode } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ApiBadGatewayResponse,
  ApiInternalServerErrorResponse,
  ApiTags
} from '@nestjs/swagger'
import type { SequelizePingCheckSettings } from '@nestjs/terminus'
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  SequelizeHealthIndicator
} from '@nestjs/terminus'
import { HealthCheckDTO } from '@sneusers/dtos'
import { ApiEndpoint } from '@sneusers/enums'
import type { EnvironmentVariables } from '@sneusers/models'
import OPENAPI from './openapi/health.openapi'

/**
 * @file Controllers - HealthController
 * @module sneusers/controllers/HealthController
 * @see https://docs.nestjs.com/recipes/terminus#http-healthcheck
 */

@Controller(OPENAPI.controller)
@ApiTags(...OPENAPI.tags)
export default class HealthController {
  constructor(
    private readonly config: ConfigService<EnvironmentVariables, true>,
    private readonly db: SequelizeHealthIndicator,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator
  ) {}

  @Get()
  @HttpCode(OPENAPI.get.status)
  @HealthCheck()
  @ApiInternalServerErrorResponse(OPENAPI.get.responses[500])
  @ApiBadGatewayResponse(OPENAPI.get.responses[502])
  async get(): Promise<HealthCheckDTO> {
    const HOST = this.config.get<string>('HOST')

    const checks: [string, SequelizePingCheckSettings | string][] = [
      ['database', {}],
      [ApiEndpoint.DOCS, HOST],
      [ApiEndpoint.USERS, [HOST, ApiEndpoint.USERS].join('/')]
    ]

    const healthIndicators = checks.sort().map(([key, args]) => {
      if (typeof args === 'object') return () => this.db.pingCheck(key, args)
      return () => this.http.pingCheck(key, args)
    })

    return this.health.check(healthIndicators)
  }
}
