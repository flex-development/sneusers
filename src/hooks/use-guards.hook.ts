import type { INestApplication } from '@nestjs/common'

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
 * @param {INestApplication} app - NestJS application
 * @return {Promise<INestApplication>} Promise containing enhanced `app`
 */
const useGuards = async (app: INestApplication): Promise<INestApplication> => {
  return app
}

export default useGuards
