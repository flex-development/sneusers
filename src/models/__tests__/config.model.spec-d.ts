/**
 * @file Type Tests - Config
 * @module sneusers/models/tests/unit-d/Config
 */

import type { IConfig } from '#src/interfaces'
import type TestSubject from '../config.model'

describe('unit-d:models/Config', () => {
  it('should implement IConfig', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<IConfig>()
  })
})
