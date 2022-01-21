import { PickType } from '@nestjs/swagger'
import RequestVerifDTO from './request-verif.dto'

/**
 * @file Auth Subdomain DTOs - RequestVerifResendDTO
 * @module sneusers/subdomains/auth/models/RequestVerifResendDTO
 */

/**
 * Data used to resend user verification data.
 *
 * @extends {Pick<RequestVerifDTO, 'type'>}
 */
class RequestVerifResendDTO extends PickType(RequestVerifDTO, ['type']) {}

export default RequestVerifResendDTO
