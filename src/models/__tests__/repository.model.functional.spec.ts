/**
 * @file Functional Tests - Repository
 * @module sneusers/models/tests/functional/Repository
 */

import Subscriber from '#fixtures/subscriber.entity'
import SubscriberFactory from '#fixtures/subscriber.factory'
import DatabaseModule from '#src/database/database.module'
import type { Spy } from '#tests/interfaces'
import createTestingModule from '#tests/utils/create-testing-module'
import { MongoEntityManager } from '@mikro-orm/mongodb'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import type { TestingModule } from '@nestjs/testing'
import TestSubject from '../repository.model'

describe('functional:models/Repository', () => {
  let em: MongoEntityManager
  let factory: SubscriberFactory
  let ref: TestingModule
  let subject: TestSubject<Subscriber>

  beforeAll(async () => {
    ref = await createTestingModule({
      imports: [DatabaseModule, MikroOrmModule.forFeature([Subscriber])]
    })

    em = ref.get(MongoEntityManager).fork()
    factory = new SubscriberFactory(em)
    subject = new TestSubject(em, Subscriber)
  })

  describe('#persist', () => {
    let entities: Subscriber[]
    let persist: Spy<MongoEntityManager['persist']>
    let validate: Spy<TestSubject['validate']>

    beforeAll(() => {
      entities = factory.make(5)
    })

    beforeEach(() => {
      persist = vi.spyOn(em, 'persist')
      validate = vi.spyOn(subject, 'validate') as typeof validate

      subject.persist(entities)
    })

    it('should validate entities', () => {
      expect(validate).toHaveBeenCalledTimes(entities.length)
    })

    it('should persist entities', () => {
      expect(persist).toHaveBeenCalledTimes(entities.length)
    })
  })

  describe('#persistAndFlush', () => {
    let flush: Spy<MongoEntityManager['flush']>
    let persist: Spy<TestSubject['persist']>

    beforeAll(async () => {
      await em.getConnection().connect()
    })

    beforeEach(async () => {
      flush = vi.spyOn(em, 'flush')
      persist = vi.spyOn(subject, 'persist') as typeof persist

      await subject.persistAndFlush(factory.make(5))
    })

    afterAll(async () => {
      await em.getConnection().close(true)
    })

    it('should persist entities', async () => {
      expect(persist).toHaveBeenCalledOnce()
    })

    it('should flush persisted changes', async () => {
      expect(flush).toHaveBeenCalledOnce()
    })
  })
})
