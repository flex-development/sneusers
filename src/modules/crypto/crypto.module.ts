import { Module } from '@nestjs/common'
import { ScryptService } from './providers'

/**
 * @file CryptoModule
 * @module sneusers/modules/crypto/CryptoModule
 */

@Module({ exports: [ScryptService], providers: [ScryptService] })
export default class CryptoModule {}
