import type { INestApplication } from '@nestjs/common'

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
 * @param {INestApplication} app - NestJS application
 * @return {Promise<INestApplication>} Promise containing enhanced `app`
 */
const usePipes = async (app: INestApplication): Promise<INestApplication> => {
  return app
}

export default usePipes
