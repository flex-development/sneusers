/**
 * @file Unit Tests - User
 * @module sneusers/subdomains/users/entities/tests/unit/User
 */

import { ObjectId } from '@mikro-orm/mongodb'
import TestSubject from '../user.entity'

describe('unit:subdomains/users/entities/User', () => {
  let _id: ObjectId
  let created_at: number
  let email: string
  let subject: TestSubject

  beforeAll(() => {
    subject = new TestSubject({
      _id: (_id = new ObjectId('64471ed6a209d3a19231144a')),
      created_at: (created_at = Date.now()),
      email: (email = faker.internet.email())
    })
  })

  describe('constructor', () => {
    it('should set #_id', () => {
      expect(subject).to.have.property('_id').deep.equal(_id)
    })

    it('should set #created_at', () => {
      expect(subject).to.have.property('created_at').equal(created_at)
    })

    it('should set #display_name', () => {
      expect(subject).to.have.property('display_name').be.null
    })

    it('should set #email', () => {
      expect(subject).to.have.property('email').equal(email.toLowerCase())
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id').equal(_id.toString())
    })

    it('should set #updated_at', () => {
      expect(subject).to.have.property('updated_at').be.null
    })
  })
})
