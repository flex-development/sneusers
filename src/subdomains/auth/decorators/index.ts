/**
 * @file Auth Subdomain Entry Point - Decorators
 * @module sneusers/subdomains/auth/decorators
 * @see https://docs.nestjs.com/custom-decorators
 */

export { default as CsrfTokenAuth } from './csrf-token-auth.decorator'
export { default as CsrfToken } from './csrf-token.decorator'
export type { CsrfTokenFn } from './csrf-token.decorator'
