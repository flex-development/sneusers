/**
 * @file Auth Subdomain Enums - AuthMetadataKey
 * @module sneusers/subdomains/auth/enums/AuthMetadataKey
 */

/**
 * Custom metadata keys.
 *
 * @see https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata
 *
 * @enum {Uppercase<string>}
 */
enum AuthMetadataKey {
  JWT_OPTIONAL = 'JWT_OPTIONAL'
}

export default AuthMetadataKey
