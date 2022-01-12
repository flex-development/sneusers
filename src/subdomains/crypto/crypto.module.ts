import { Module } from '@nestjs/common'
import { HashService } from './providers'

/**
 * @file Crypto Subdomain - CryptoModule
 * @module sneusers/subdomains/crypto/CryptoModule
 */

@Module({ exports: [HashService], providers: [HashService] })
export default class CryptoModule {}
