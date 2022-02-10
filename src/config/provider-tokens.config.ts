import { forwardRef, ForwardReference as ForwardRef } from '@nestjs/common'

/**
 * @file Configuration - Provider Tokens
 * @module sneusers/config/provider-tokens
 */

/** @property {ForwardRef<string>} AXIOS_INSTANCE - `AxiosInstance` */
export const AXIOS_INSTANCE: ForwardRef<string> = forwardRef(() => {
  return 'AXIOS_INSTANCE_TOKEN'
})
