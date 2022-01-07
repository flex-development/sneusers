import type { INestApplication } from '@nestjs/common'
import { ExceptionClassFilter } from '@sneusers/filters'

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
  app = app.useGlobalFilters(new ExceptionClassFilter())
  return app
}

export default useExceptionFilters
