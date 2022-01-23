import { MailerModule } from '@nestjs-modules/mailer'
import { Global, Module } from '@nestjs/common'
import { EMAIL_SERVICE } from './email.module.constants'
import { EmailService, MailerConfigService } from './providers'

/**
 * @file EmailModule
 * @module sneusers/modules/email/EmailModule
 */

@Global()
@Module({
  exports: [EMAIL_SERVICE],
  imports: [MailerModule.forRootAsync(MailerConfigService.moduleOptions)],
  providers: [{ provide: EMAIL_SERVICE, useClass: EmailService }]
})
export default class EmailModule {}
