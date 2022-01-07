import type { INestApplication } from '@nestjs/common'
import useExceptionFilters from './use-exception-filters.hook'
import useGuards from './use-guards.hook'
import useInterceptors from './use-interceptors.hook'
import usePipes from './use-pipes.hook'
import useSwagger from './use-swagger.hook'

/**
 * @file Hooks - useGlobal
 * @module sneusers/hooks/useGlobal
 */

/**
 * Configures `app` to:
 *
 * - Serve [API][1] documentation from the root endpoint, `/`
 * - Apply global exception filters, guards, interceptors, and pipes
 *
 * [1]: https://docs.nestjs.com/openapi/introduction
 *
 * @see https://docs.nestjs.com/exception-filters
 * @see https://docs.nestjs.com/guards
 * @see https://docs.nestjs.com/interceptors
 * @see https://docs.nestjs.com/pipes
 * @see https://docs.nestjs.com/faq/global-prefix
 *
 * @async
 * @param {INestApplication} app - NestJS application
 * @return {Promise<INestApplication>} Promise containing enhanced `app`
 */
const useGlobal = async (app: INestApplication): Promise<INestApplication> => {
  // Configure app to serve docs from root endpoint
  app = await useSwagger(app)

  // Apply global configurations
  app = await useExceptionFilters(app)
  app = await useGuards(app)
  app = await useInterceptors(app)
  app = await usePipes(app)

  // Return enhanced app
  return app
}

export default useGlobal
