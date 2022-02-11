import { MailerModule } from '@nestjs-modules/mailer'
import { Global, Module } from '@nestjs/common'
import { EmailService, MailerConfigService } from './providers'

/**
 * @file EmailModule
 * @module sneusers/modules/email/EmailModule
 */

@Global()
@Module({
  exports: [EmailService],
  imports: [MailerModule.forRootAsync(MailerConfigService.moduleOptions)],
  providers: [EmailService]
})
export default class EmailModule {}
