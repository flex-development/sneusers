import { Injectable } from '@nestjs/common'
import type { ExceptionDataDTO } from '@sneusers/dtos'
import { ExceptionCode } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import crypto from 'crypto'

/**
 * @file Crypto Subdomain Providers - HashService
 * @module sneusers/subdomains/crypto/providers/HashService
 */

@Injectable()
export default class HashService {
  /**
   * @static
   * @readonly
   * @property {BufferEncoding} BUFFER_ENCODING - Buffer encoding type
   */
  static readonly BUFFER_ENCODING: BufferEncoding = 'hex'

  /**
   * Hashes a value.
   *
   * @async
   * @param {string} secret - Value to hash
   * @return {Promise<string>} Promise containing hashed value
   * @throws {Exception}
   */
  async hash(secret: string): Promise<string> {
    const salt = await this.salt()

    return await new Promise<string>((resolve, reject) => {
      crypto.scrypt(secret, salt, 64, (error, derivedKey) => {
        if (error !== null) {
          const code = ExceptionCode.UNPROCESSABLE_ENTITY
          const message = 'Secret hashing failure'
          const data: ExceptionDataDTO<Error> = {
            errors: [error],
            message: error.message,
            salt,
            secret
          }

          reject(new Exception<Error>(code, message, data, error.stack))
        }

        resolve(`${salt}:${derivedKey.toString('hex')}`)
      })
    })
  }

  /**
   * Creates a unique salt for a hashed value.
   *
   * @async
   * @return {Promise<string>} Promise containing unique salt
   */
  async salt(): Promise<string> {
    return crypto.randomBytes(16).toString(HashService.BUFFER_ENCODING)
  }

  /**
   * Checks a plaintext value against a hashed secret.
   *
   * @async
   * @param {string} secret - Hashed secret
   * @param {string} credential - Plaintext value
   * @return {Promise<boolean>} Promise containing `true` if verified
   * @throws {Exception}
   */
  async verify(secret: string, credential: string): Promise<boolean> {
    const verified = await new Promise<boolean>((resolve, reject) => {
      const [salt, key] = secret.split(':')

      crypto.scrypt(credential, salt as string, 64, (error, derivedKey) => {
        if (error !== null) {
          const code = ExceptionCode.UNAUTHORIZED
          const message = 'Secret authorization failure'
          const data: ExceptionDataDTO<Error> = {
            credential,
            errors: [error],
            message: error.message
          }

          reject(new Exception<Error>(code, message, data, error.stack))
        }

        resolve(key === derivedKey.toString('hex'))
      })
    })

    if (!verified) {
      throw new Exception(ExceptionCode.UNAUTHORIZED, 'Invalid credentials', {
        credential
      })
    }

    return verified
  }
}
