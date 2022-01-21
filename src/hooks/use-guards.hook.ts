import type { NestExpressApplication } from '@nestjs/platform-express'

/**
 * @file Hooks - useGuards
 * @module sneusers/hooks/useGuards
 */

/**
 * Applies global [guards][1].
 *
 * [1]: https://docs.nestjs.com/guards
 *
 * @async
 * @param {NestExpressApplication} app - NestJS application
 * @return {Promise<NestExpressApplication>} Promise containing enhanced `app`
 */
const useGuards = async (
  app: NestExpressApplication
): Promise<NestExpressApplication> => {
  return app
}

export default useGuards
