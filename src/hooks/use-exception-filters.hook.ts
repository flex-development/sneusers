import type { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExceptionClassFilter, HttpExceptionFilter } from '@sneusers/filters'
import type { EnvironmentVariables } from '@sneusers/models'

/**
 * @file Hooks - useExceptionFilters
 * @module sneusers/hooks/useExceptionFilters
 */

/**
 * Applies global [exception filters][1].
 *
 * [1]: https://docs.nestjs.com/exception-filters
 *
 * @async
 * @param {INestApplication} app - NestJS application
 * @return {Promise<INestApplication>} Promise containing enhanced `app`
 */
const useExceptionFilters = async (
  app: INestApplication
): Promise<INestApplication> => {
  const conf: ConfigService<EnvironmentVariables, true> = app.get(ConfigService)

  app = app.useGlobalFilters(new ExceptionClassFilter(conf))
  app = app.useGlobalFilters(new HttpExceptionFilter(conf))

  return app
}

export default useExceptionFilters
