import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { CreateEmailDTO, EmailSentDTO } from '@sneusers/modules/email/dtos'

/**
 * @file EmailModule Providers - EmailService
 * @module sneusers/modules/email/providers/EmailService
 */

@Injectable()
class EmailService implements OnModuleInit {
  constructor(protected readonly mailer: MailerService) {}

  /**
   * Verifies the SMTP transport configuration.
   *
   * @see https://nodemailer.com/smtp#verify-smtp-connection-configuration
   *
   * @async
   * @return {Promise<void>} Empty promise when complete
   */
  async onModuleInit(): Promise<void> {
    // @ts-expect-error Property 'transporter' is private
    await this.mailer.transporter.verify()
    return
  }

  /**
   * Sends an email.
   *
   * @async
   * @param {CreateEmailDTO} [options={}] - Email sending options
   * @return {Promise<EmailSentDTO>} Promise containing message details
   */
  async send(options: CreateEmailDTO = {}): Promise<EmailSentDTO> {
    if (options.from) Reflect.deleteProperty(options, 'from')

    return await this.mailer.sendMail({
      ...options,
      context: options.context || {},
      template: options.template && `./views/layouts/${options.template}`
    })
  }
}
export default EmailService
