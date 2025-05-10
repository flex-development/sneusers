import type { Account } from '@flex-development/sneusers/accounts'
import type {} from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    /**
     * The account of the currently authenticated user.
     *
     * @see {@linkcode Account}
     */
    user?: Account | null | undefined
  }

  interface Params {
    [x: string]: string | undefined

    /**
     * The id of a user account.
     */
    uid?: string | undefined
  }

  interface RouteGenericInterface {
    Params: Params
  }
}
