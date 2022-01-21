import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport'

/**
 * @file Data Transfer Objects - EmailSentDTO
 * @module sneusers/dtos/EmailSentDTO
 */

/**
 * Email sent result.
 *
 * @implements {Omit<SentMessageInfo, 'pending'>}
 */
class EmailSentDTO implements Omit<SentMessageInfo, 'pending'> {
  accepted: SentMessageInfo['accepted']
  envelope: SentMessageInfo['envelope']
  envelopeTime: number
  messageId: SentMessageInfo['messageId']
  messageSize: number
  messageTime: number
  pending?: SentMessageInfo['pending']
  rejected: SentMessageInfo['rejected']
  response: SentMessageInfo['response']
}

export default EmailSentDTO
