import type { ObjectPlain } from '@flex-development/tutils'
import type { MailerOptions } from '@sneusers/types'

/**
 * @file Data Transfer Objects - CreateEmailSentDTO
 * @module sneusers/dtos/CreateEmailSentDTO
 */

/**
 * Email sending options.
 */
type CreateEmailSentDTO = MailerOptions & {
  context?: ObjectPlain
  template?: `${'layouts'}/${string}`
}

export default CreateEmailSentDTO
