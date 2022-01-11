/**
 * @file Auth Subdomain Guards - Entry Point
 * @module sneusers/subdomains/auth/guards
 * @see https://docs.nestjs.com/guards
 * @see https://docs.nestjs.com/security/authentication#extending-guards
 */

export { default as JwtAuthGuard } from './jwt-auth.guard'
export { default as LocalAuthGuard } from './local-auth.guard'
