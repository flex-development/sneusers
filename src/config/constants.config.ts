import pkg from 'read-pkg'

/**
 * @file Configuration - Constant Values
 * @module sneusers/config/constants
 */

/** @property {Package} PACKAGE - `package.json` data */
export const PACKAGE: Package = pkg.sync({ normalize: false }) as Package
