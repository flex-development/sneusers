/**
 * @file Unit Tests - PaginatedDTO
 * @module sneusers/dtos/tests/unit/PaginatedDTO
 */

import type { ObjectPlain } from '@flex-development/tutils'
import TestSubject from '../paginated.dto'

describe('unit:dtos/PaginatedDTO', () => {
  let count: number
  let limit: number
  let offset: number
  let results: ObjectPlain[]
  let subject: TestSubject
  let total: number

  beforeAll(() => {
    subject = new TestSubject({
      count: (count = faker.number.int()),
      limit: (limit = faker.number.int()),
      offset: (offset = faker.number.int()),
      results: (results = [{ value: faker.number.int() }]),
      total: (total = faker.number.int())
    })
  })

  describe('constructor', () => {
    it('should set #count', () => {
      expect(subject).to.have.property('count').equal(count)
    })

    it('should set #limit', () => {
      expect(subject).to.have.property('limit').equal(limit)
    })

    it('should set #offset', () => {
      expect(subject).to.have.property('offset').equal(offset)
    })

    it('should set #results', () => {
      expect(subject).to.have.property('results').deep.equal(results)
    })

    it('should set #total', () => {
      expect(subject).to.have.property('total').equal(total)
    })
  })
})
