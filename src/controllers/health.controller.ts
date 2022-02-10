import { Controller, Get, HttpCode } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiTags } from '@nestjs/swagger'
import type { SequelizePingCheckSettings } from '@nestjs/terminus'
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  SequelizeHealthIndicator
} from '@nestjs/terminus'
import { ApiResponses } from '@sneusers/decorators'
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
    protected readonly config: ConfigService<EnvironmentVariables, true>,
    protected readonly db: SequelizeHealthIndicator,
    protected readonly health: HealthCheckService,
    protected readonly http: HttpHealthIndicator
  ) {}

  @HealthCheck()
  @Get(OPENAPI.get.path)
  @HttpCode(OPENAPI.get.status)
  @ApiResponses(OPENAPI.get.responses)
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
