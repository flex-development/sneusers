import type { ISendMailOptions } from '@nestjs-modules/mailer'

/**
 * @file EmailModule DTOs - CreateEmailDTO
 * @module sneusers/modules/email/dtos/CreateEmailDTO
 */

/**
 * Email sending options.
 *
 * @extends {ISendMailOptions}
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateEmailDTO extends ISendMailOptions {}

export default CreateEmailDTO
