import type { NestExpressApplication } from '@nestjs/platform-express'

/**
 * @file Hooks - usePipes
 * @module sneusers/hooks/usePipes
 */

/**
 * Applies global [pipes][1].
 *
 * [1]: https://docs.nestjs.com/pipes
 *
 * @async
 * @param {NestExpressApplication} app - NestJS application
 * @return {Promise<NestExpressApplication>} Promise containing enhanced `app`
 */
const usePipes = async (
  app: NestExpressApplication
): Promise<NestExpressApplication> => {
  return app
}

export default usePipes
