import type { HelmetOptions as IHelmetOptions } from 'helmet'

/**
 * @file MiddlewareModule Abstracts - HelmetOptions
 * @module sneusers/modules/middleware/abstracts/HelmetOptions
 */

/**
 * [`helmet`][1] configuration options.
 *
 * [1]: https://github.com/helmetjs/helmet
 *
 * @abstract
 * @implements {IHelmetOptions}
 */
abstract class HelmetOptions implements IHelmetOptions {
  contentSecurityPolicy?: IHelmetOptions['contentSecurityPolicy']
  crossOriginEmbedderPolicy?: IHelmetOptions['crossOriginEmbedderPolicy']
  crossOriginOpenerPolicy?: IHelmetOptions['crossOriginOpenerPolicy']
  crossOriginResourcePolicy?: IHelmetOptions['crossOriginResourcePolicy']
  dnsPrefetchControl?: IHelmetOptions['dnsPrefetchControl']
  expectCt?: IHelmetOptions['expectCt']
  frameguard?: IHelmetOptions['frameguard']
  hidePoweredBy?: IHelmetOptions['hidePoweredBy']
  hsts?: IHelmetOptions['hsts']
  ieNoOpen?: IHelmetOptions['ieNoOpen']
  noSniff?: IHelmetOptions['noSniff']
  originAgentCluster?: IHelmetOptions['originAgentCluster']
  permittedCrossDomainPolicies?: IHelmetOptions['permittedCrossDomainPolicies']
  referrerPolicy?: IHelmetOptions['referrerPolicy']
  xssFilter?: IHelmetOptions['xssFilter']
}

export default HelmetOptions
