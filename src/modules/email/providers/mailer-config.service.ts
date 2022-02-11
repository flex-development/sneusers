import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables as EnvVars } from '@sneusers/models'
import * as SMTPTransport from 'nodemailer/lib/smtp-transport'
import path from 'path'

/**
 * @file EmailModule Providers - MailerConfigService
 * @module sneusers/modules/email/providers/MailerConfigService
 */

@Injectable()
class MailerConfigService implements MailerOptionsFactory {
  constructor(protected readonly config: ConfigService<EnvVars, true>) {}

  /**
   * Get [`MailerModule`][1] configuration options.
   *
   * [1]: https://nest-modules.github.io/mailer/docs/mailer#async-configuration
   *
   * @static
   * @return {MailerAsyncOptions} Module options
   */
  static get moduleOptions(): MailerAsyncOptions {
    return { useClass: MailerConfigService }
  }

  /**
   * Get [mailer][1] configuration options.
   *
   * [1]: https://nest-modules.github.io/mailer/docs/mailer#service
   *
   * @return {MailerOptions} Mailer configuration options
   */
  createMailerOptions(): MailerOptions {
    const viewPath = path.join(process.cwd(), 'views')

    return {
      defaults: {
        from: this.config.get<string>('EMAIL_SEND_AS')
      } as SMTPTransport.Options,
      options: {
        partials: {
          dir: path.join(viewPath, 'partials'),
          options: { strict: true }
        }
      },
      preview: !this.config.get<boolean>('TEST'),
      template: {
        adapter: new HandlebarsAdapter(undefined, {
          inlineCssEnabled: true,
          inlineCssOptions: {
            applyLinkTags: true,
            applyStyleTags: true,
            applyTableAttributes: false,
            applyWidthAttributes: false,
            codeBlocks: { HBS: { end: '}}', start: '{{' } },
            extraCss: '',
            preserveMediaQueries: true,
            removeHtmlSelectors: false,
            removeLinkTags: true,
            removeStyleTags: true,
            url: ' '
          }
        }),
        dir: viewPath,
        options: { strict: true }
      },
      transport: {
        auth: {
          privateKey: this.config.get<string>('EMAIL_PRIVATE_KEY'),
          serviceClient: this.config.get<string>('EMAIL_CLIENT'),
          type: 'OAuth2',
          user: this.config.get<string>('EMAIL_USER')
        },
        debug: true,
        host: this.config.get<string>('EMAIL_HOST'),
        logger: !this.config.get<boolean>('TEST'),
        port: this.config.get<number>('EMAIL_PORT'),
        secure: true,
        transactionLog: true
      } as SMTPTransport.Options
    }
  }
}

export default MailerConfigService
