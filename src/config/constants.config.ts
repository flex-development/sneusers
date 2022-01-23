import { forwardRef, ForwardReference as ForwardRef } from '@nestjs/common'
import pkg from 'read-pkg'

/**
 * @file Configuration - Constant Values
 * @module sneusers/config/constants
 */

/** @property {ForwardRef<string>} AXIOS_INSTANCE - Axios instance token ref */
export const AXIOS_INSTANCE: ForwardRef<string> = forwardRef(() => {
  return 'AXIOS_INSTANCE_TOKEN'
})

/** @property {Package} PACKAGE - `package.json` data */
export const PACKAGE: Package = pkg.sync({ normalize: false }) as Package
