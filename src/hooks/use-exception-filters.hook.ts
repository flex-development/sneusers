import type { NestExpressApplication } from '@nestjs/platform-express'

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
 * @param {NestExpressApplication} app - NestJS application
 * @return {Promise<NestExpressApplication>} Promise containing enhanced `app`
 */
const useExceptionFilters = async (
  app: NestExpressApplication
): Promise<NestExpressApplication> => {
  return app
}

export default useExceptionFilters
