/**
 * @file Functional Tests - InjectMapper
 * @module sneusers/database/decorators/tests/functional/InjectMapper
 */

import TestSubject from '#database/decorators/inject-mapper.decorator'
import * as common from '@nestjs/common'

vi.mock('@nestjs/common', () => ({ Inject: vi.fn() }))

describe('functional:database/decorators/InjectMapper', () => {
  let Entity: { name: string }
  let token: string

  beforeAll(() => {
    Entity = { name: 'Account' }
    token = Entity.name + 'Mapper'
  })

  beforeEach(() => {
    TestSubject(Entity)
  })

  it('should inject data mapper for `Entity`', () => {
    expect(common.Inject).toHaveBeenCalledExactlyOnceWith(token)
  })
})
