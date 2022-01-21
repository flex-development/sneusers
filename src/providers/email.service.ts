import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import viewEngine from '@sneusers/config/view-engine.config'
import { CreateEmailSentDTO, EmailSentDTO } from '@sneusers/dtos'
import type { EnvironmentVariables as EnvVars } from '@sneusers/models'
import { createTransport } from 'nodemailer'
import nexphbs from 'nodemailer-express-handlebars'
import type { PluginFunction } from 'nodemailer/lib/mailer'
import Mailer from 'nodemailer/lib/mailer'
import type { Options as TransportOptions } from 'nodemailer/lib/smtp-transport'
import path from 'path'

/**
 * @file Providers - EmailService
 * @module sneusers/providers/EmailService
 */

@Injectable()
export default class EmailService implements OnModuleInit {
  /**
   * @private
   * @readonly
   * @property {Mailer<EmailSentDTO>} transporter - SMTP transporter
   */
  private readonly transporter: Mailer<EmailSentDTO>

  constructor(protected readonly config: ConfigService<EnvVars, true>) {
    const options: TransportOptions = {
      auth: {
        privateKey: config.get<string>('EMAIL_PRIVATE_KEY'),
        serviceClient: config.get<string>('EMAIL_CLIENT'),
        type: 'OAuth2',
        user: config.get<string>('EMAIL_USER')
      },
      debug: true,
      host: config.get<string>('EMAIL_HOST'),
      logger: !config.get<boolean>('TEST'),
      port: config.get<number>('EMAIL_PORT'),
      secure: true,
      transactionLog: true
    }

    const defaults: TransportOptions = {
      from: config.get<string>('EMAIL_SEND_AS')
    }

    const hbs: PluginFunction<EmailSentDTO> = nexphbs({
      extName: '.hbs',
      viewEngine,
      viewPath: path.join(process.cwd(), 'views')
    })

    this.transporter = createTransport<EmailSentDTO>(options, defaults)
    this.transporter.use('compile', hbs)
  }

  /**
   * Verifies the {@link transporter}'s SMTP configuration.
   *
   * @see {@link transporter}
   * @see https://nodemailer.com/smtp#verify-smtp-connection-configuration
   *
   * @async
   * @return {Promise<void>} Empty promise when complete
   */
  async onModuleInit(): Promise<void> {
    await this.transporter.verify()
    return
  }

  /**
   * Sends an email.
   *
   * @async
   * @param {CreateEmailSentDTO} [options={}] - Email sending options
   * @return {Promise<EmailSentDTO>} Promise containing email sent response
   */
  async send(options: CreateEmailSentDTO = {}): Promise<EmailSentDTO> {
    if (options['from']) Reflect.deleteProperty(options, 'from')
    return await this.transporter.sendMail(options)
  }
}
