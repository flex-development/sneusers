import { ISendMailOptions } from '@nestjs-modules/mailer'

/**
 * @file EmailModule DTOs - CreateEmailDTO
 * @module sneusers/modules/email/dtos/CreateEmailDTO
 */

/**
 * Email sending options.
 *
 * @implements {ISendMailOptions}
 */
class CreateEmailDTO implements ISendMailOptions {
  alternatives?: ISendMailOptions['alternatives']
  amp?: ISendMailOptions['amp']
  attachments?: ISendMailOptions['attachments']
  bcc?: ISendMailOptions['bcc']
  cc?: ISendMailOptions['cc']
  context?: ISendMailOptions['context']
  date?: ISendMailOptions['date']
  disableFileAccess?: ISendMailOptions['disableFileAccess']
  disableUrlAccess?: ISendMailOptions['disableUrlAccess']
  dkim?: ISendMailOptions['dkim']
  encoding?: ISendMailOptions['encoding']
  envelope?: ISendMailOptions['envelope']
  from?: ISendMailOptions['from']
  headers?: ISendMailOptions['headers']
  html?: ISendMailOptions['html']
  icalEvent?: ISendMailOptions['icalEvent']
  inReplyTo?: ISendMailOptions['inReplyTo']
  list?: ISendMailOptions['list']
  messageId?: ISendMailOptions['messageId']
  normalizeHeaderKey?: ISendMailOptions['normalizeHeaderKey']
  priority?: ISendMailOptions['priority']
  raw?: ISendMailOptions['raw']
  references?: ISendMailOptions['references']
  replyTo?: ISendMailOptions['replyTo']
  sender?: ISendMailOptions['sender']
  subject?: ISendMailOptions['subject']
  template?: ISendMailOptions['template']
  text?: ISendMailOptions['text']
  textEncoding?: ISendMailOptions['textEncoding']
  to?: ISendMailOptions['to']
  transporterName?: ISendMailOptions['transporterName']
  watchHtml?: ISendMailOptions['watchHtml']
}

export default CreateEmailDTO
