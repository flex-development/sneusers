import type { EmailSentDTO } from '@sneusers/dtos'
import type Mailer from 'nodemailer/lib/mailer'

/**
 * @file Data Transfer Objects - MailerOptions
 * @module sneusers/dtos/MailerOptions
 */

/**
 * {@link Mailer} options.
 */
type MailerOptions = Mailer<EmailSentDTO>['options']

export default MailerOptions
