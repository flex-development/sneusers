/**
 * @file Unit Tests - Config
 * @module sneusers/models/tests/unit/Config
 */

import TestSubject from '#models/config.model'

describe('unit:models/Config', () => {
  describe('constructor', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject({})
    })

    it('should set `HOST`', () => {
      expect(subject).to.have.property('HOST', '127.0.0.1')
    })

    it('should set `HOSTNAME`', () => {
      expect(subject).to.have.property('HOSTNAME', 'localhost')
    })

    it('should set `JWT_EXPIRY`', () => {
      expect(subject).to.have.property('JWT_EXPIRY', 900)
    })

    it('should set `JWT_EXPIRY_REFRESH`', () => {
      expect(subject).to.have.property('JWT_EXPIRY_REFRESH', 86400)
    })

    it('should set `JWT_SECRET`', () => {
      expect(subject).to.have.property('JWT_SECRET').be.a('string')
      expect(subject).to.have.property('JWT_SECRET').be.not.empty
    })

    it('should set `NODE_ENV`', () => {
      expect(subject).to.have.property('NODE_ENV', 'development')
    })

    it('should set `PORT`', () => {
      expect(subject).to.have.property('PORT', 8080)
    })

    it.each<[key: keyof TestSubject, value: string | null | undefined]>([
      ['HOST', ' '],
      ['HOSTNAME', ' '],
      ['NODE_ENV', 'dev']
    ])('should throw if config is invalid ({ %s: %j })', (key, value) => {
      // Arrange
      let error!: AggregateError

      // Act
      try {
        new TestSubject(Object.assign({}, { [key]: value }))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.not.be.undefined
      expect(error).to.be.instanceof(AggregateError)
      expect(error).to.have.property('message', 'Invalid app configuration')
      expect(error.errors).to.be.an('array').of.length(1)
      expect(error.errors).toMatchSnapshot()
    })
  })
})
