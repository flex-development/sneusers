import { Global, Module } from '@nestjs/common'
import { HASH_SERVICE } from './crypto.module.constants'
import { HashService } from './providers'

/**
 * @file CryptoModule
 * @module sneusers/modules/crypto/CryptoModule
 */

@Global()
@Module({
  exports: [HASH_SERVICE],
  providers: [{ provide: HASH_SERVICE, useClass: HashService }]
})
export default class CryptoModule {}
