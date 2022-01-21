import type { NestExpressApplication } from '@nestjs/platform-express'

/**
 * @file Hooks - useInterceptors
 * @module sneusers/hooks/useInterceptors
 */

/**
 * Applies global [interceptors][1].
 *
 * [1]: https://docs.nestjs.com/interceptors
 *
 * @async
 * @param {NestExpressApplication} app - NestJS application
 * @return {Promise<NestExpressApplication>} Promise containing enhanced `app`
 */
const useInterceptors = async (
  app: NestExpressApplication
): Promise<NestExpressApplication> => {
  return app
}

export default useInterceptors
