/**
 * @file Auth Subdomain Entry Point - Data Transfer Objects
 * @module sneusers/subdomains/auth/dtos
 * @see https://khalilstemmler.com/articles/enterprise-typescript-nodejs/use-dtos-to-enforce-a-layer-of-indirection
 */

export { default as CreateTokenDTO } from './create-token.dto'
export { default as JwtPayloadAccess } from './jwt-payload-access.dto'
export { default as JwtPayloadRefresh } from './jwt-payload-refresh.dto'
export { default as JwtPayloadVerif } from './jwt-payload-verif.dto'
export type { default as JwtPayload } from './jwt-payload.dto'
export { default as LoginDTO } from './login.dto'
export { default as PatchTokenDTO } from './patch-token.dto'
export { default as RegisterUserDTO } from './register-user.dto'
export { default as RequestGitHubAuthDTO } from './request-github-auth.dto'
export { default as RequestGoogleAuthDTO } from './request-google-auth.dto'
export { default as RequestLoginDTO } from './request-login.dto'
export { default as RequestVerifResendDTO } from './request-verif-resend.dto'
export { default as RequestVerifDTO } from './request-verif.dto'
export { default as ResolvedToken } from './resolved-token.dto'
export { default as VerifEmailSentDTO } from './verif-email-sent.dto'
export { default as WhoamiDTO } from './whoami.dto'
