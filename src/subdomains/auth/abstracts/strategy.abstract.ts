import { AbstractStrategy as NestAbstractStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { Strategy as IStrategy } from 'passport'
import type { AuthenticateOptions } from '../namespaces'

/**
 * @file Auth Subdomain Abstracts - AbstractStrategy
 * @module sneusers/subdomains/auth/abstracts/AbstractStrategy
 */

/**
 * Abstract authentication strategy.
 *
 * @abstract
 * @implements {IStrategy}
 * @implements {NestAbstractStrategy}
 */
abstract class AbstractStrategy implements IStrategy, NestAbstractStrategy {
  abstract readonly name?: string
  abstract authenticate(req: Request, options?: AuthenticateOptions.Base): any
  abstract validate(...args: any[]): any
}

export default AbstractStrategy
