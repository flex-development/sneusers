import { SessionOptions as ISessionOptions } from 'express-session'

/**
 * @file MiddlewareModule Abstracts - SessionOptions
 * @module sneusers/modules/middleware/abstracts/SessionOptions
 */

/**
 * [`session`][1] configuration options.
 *
 * [1]: https://github.com/expressjs/session
 *
 * @abstract
 * @implements {ISessionOptions}
 */
abstract class SessionOptions implements ISessionOptions {
  cookie?: ISessionOptions['cookie']
  genid?: ISessionOptions['genid']
  name?: ISessionOptions['name']
  proxy?: ISessionOptions['proxy']
  resave?: ISessionOptions['resave']
  rolling?: ISessionOptions['rolling']
  saveUninitialized?: ISessionOptions['saveUninitialized']
  secret: ISessionOptions['secret']
  store?: ISessionOptions['store']
  unset?: ISessionOptions['unset']
}

export default SessionOptions
