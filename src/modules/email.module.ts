import { Global, Module } from '@nestjs/common'
import { EmailService } from '@sneusers/providers'

/**
 * @file Modules - EmailModule
 * @module sneusers/modules/EmailModule
 */

@Global()
@Module({ exports: [EmailService], providers: [EmailService] })
export default class EmailModule {}
