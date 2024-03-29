/**
 * @file Type Tests - IConfig
 * @module sneusers/interfaces/tests/unit-d/IConfig
 */

import type { AppEnv, NodeEnv } from '@flex-development/tutils'
import type TestSubject from '../config.interface'

describe('unit-d:interfaces/IConfig', () => {
  it('should match [APP_ENV: AppEnv]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('APP_ENV')
      .toEqualTypeOf<AppEnv>()
  })

  it('should match [DB_HOSTNAME: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('DB_HOSTNAME').toBeString()
  })

  it('should match [DB_NAME: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('DB_NAME').toBeString()
  })

  it('should match [DB_PASSWORD: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('DB_PASSWORD').toBeString()
  })

  it('should match [DB_PORT: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('DB_PORT').toBeNumber()
  })

  it('should match [DB_USERNAME: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('DB_USERNAME').toBeString()
  })

  it('should match [HTTPS_CERT: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('HTTPS_CERT').toBeString()
  })

  it('should match [HTTPS_KEY: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('HTTPS_KEY').toBeString()
  })

  it('should match [NODE_ENV: NodeEnv]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('NODE_ENV')
      .toEqualTypeOf<NodeEnv>()
  })

  it('should match [URL: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('URL').toBeString()
  })
})
