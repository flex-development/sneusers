/**
 * @file Unit Tests - Config
 * @module sneusers/models/tests/unit/Config
 */

import { Exception } from '@flex-development/exceptions'
import { AppEnv, NodeEnv } from '@flex-development/tutils'
import type { ValidationError } from 'class-validator'
import TestSubject from '../config.model'

describe('unit:models/Config', () => {
  let APP_ENV: AppEnv
  let DB_HOSTNAME: string
  let DB_NAME: string
  let DB_PASSWORD: string
  let DB_PORT: string
  let DB_USERNAME: string
  let HTTPS_CERT: string
  let HTTPS_KEY: string
  let NODE_ENV: NodeEnv
  let URL: string
  let subject: TestSubject

  beforeAll(() => {
    subject = new TestSubject({
      APP_ENV: (APP_ENV = AppEnv.DEV),
      DB_HOSTNAME: (DB_HOSTNAME = 'db'),
      DB_NAME: (DB_NAME = APP_ENV),
      DB_PASSWORD: (DB_PASSWORD = faker.string.alphanumeric()),
      DB_PORT: (DB_PORT = '27017'),
      DB_USERNAME: (DB_USERNAME = 'admin'),
      HTTPS_CERT: (HTTPS_CERT = 'cert'),
      HTTPS_KEY: (HTTPS_KEY = 'key'),
      NODE_ENV: (NODE_ENV = NodeEnv.DEV),
      URL: (URL = 'https://localhost')
    })
  })

  describe('constructor', () => {
    it('should set #APP_ENV', () => {
      expect(subject).to.have.property('APP_ENV').equal(APP_ENV)
    })

    it('should set #DB_HOSTNAME', () => {
      expect(subject).to.have.property('DB_HOSTNAME').equal(DB_HOSTNAME)
    })

    it('should set #DB_NAME', () => {
      expect(subject).to.have.property('DB_NAME').equal(DB_NAME)
    })

    it('should set #DB_PASSWORD', () => {
      expect(subject).to.have.property('DB_PASSWORD').equal(DB_PASSWORD)
    })

    it('should set #DB_PORT', () => {
      expect(subject).to.have.property('DB_PORT').equal(+DB_PORT)
    })

    it('should set #DB_USERNAME', () => {
      expect(subject).to.have.property('DB_USERNAME').equal(DB_USERNAME)
    })

    it('should set #HTTPS_CERT', () => {
      expect(subject).to.have.property('HTTPS_CERT').equal(HTTPS_CERT)
    })

    it('should set #HTTPS_KEY', () => {
      expect(subject).to.have.property('HTTPS_KEY').equal(HTTPS_KEY)
    })

    it('should set #NODE_ENV', () => {
      expect(subject).to.have.property('NODE_ENV').equal(NODE_ENV)
    })

    it('should set #URL', () => {
      expect(subject).to.have.property('URL').equal(URL)
    })
  })

  describe('#validate', () => {
    it('should return validated configuration object', () => {
      expect(subject.validate()).to.deep.equal(subject)
    })

    it('should throw if schema is invalid', () => {
      // Arrange
      let error!: Exception<ValidationError>

      // Act
      try {
        new TestSubject({
          APP_ENV: '',
          DB_HOSTNAME: '',
          DB_NAME: '',
          DB_PASSWORD: '',
          DB_PORT: 'null',
          DB_USERNAME: '',
          NODE_ENV: '',
          URL: ''
        }).validate()
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(Exception)
      expect(error).to.have.property('code').equal('invalid-config')
      expect(error).to.have.property('errors').be.an('array').of.length(8)
      expect(error).to.have.property('message').equal('Invalid configuration')
      expect(error.errors).toMatchSnapshot()
    })
  })
})
