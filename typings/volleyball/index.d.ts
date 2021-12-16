declare module 'volleyball' {
  import type { Handler } from 'express'

  interface VolleyballConfig {
    debug?: boolean | string | ((...args: any[]) => any)
  }

  type VolleyballHandler = Handler & {
    custom(config?: VolleyballConfig): VolleyballHandler
  }

  const volleyball: VolleyballHandler

  export default volleyball
  export type { VolleyballConfig, VolleyballHandler }
}
