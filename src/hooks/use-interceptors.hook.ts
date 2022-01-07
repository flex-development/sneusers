import type { INestApplication } from '@nestjs/common'

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
 * @param {INestApplication} app - NestJS application
 * @return {Promise<INestApplication>} Promise containing enhanced `app`
 */
const useInterceptors = async (
  app: INestApplication
): Promise<INestApplication> => {
  return app
}

export default useInterceptors
