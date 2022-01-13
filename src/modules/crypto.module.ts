import { Global, Module } from '@nestjs/common'
import { HashService } from '@sneusers/providers'

/**
 * @file Modules - CryptoModule
 * @module sneusers/modules/CryptoModule
 */

@Global()
@Module({ exports: [HashService], providers: [HashService] })
export default class CryptoModule {}
