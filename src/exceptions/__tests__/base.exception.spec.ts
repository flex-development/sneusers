import ERROR from '@fixtures/error.fixture'
import EJSON from '@fixtures/exception-json.fixture'
import {
  ExceptionClassName,
  ExceptionCode,
  ExceptionId
} from '@flex-development/exceptions/enums'
import type { ExceptionDataDTO } from '@sneusers/dtos'
import type { Testcase } from '@tests/utils/types'
import TestSubject from '../base.exception'

/**
 * @file Unit Tests - Exception
 * @module sneusers/exceptions/tests/unit/Exception
 */

describe('unit:exceptions/Exception', () => {
  describe('constructor', () => {
    describe('#data', () => {
      it('should omit dto.data.errors and dto.data.message', () => {
        // Arrange
        const data = { errors: [], message: 'error message override' }

        // Act
        const Subject = new TestSubject(ExceptionCode.NOT_FOUND, null, data)

        // Assert
        expect(Subject.data).deep.equal({})
      })

      it('should use dto.data properties if isExceptionJSON(dto.data)', () => {
        // Arrange
        const message = ERROR.message

        // Act
        const Subject = new TestSubject(undefined, message, EJSON, EJSON.stack)

        // Expect
        expect(Subject.id).to.equal(EJSON.name)
        expect(Subject.toJSON()).deep.equal(EJSON)
      })
    })

    describe('#errors', () => {
      type Case = Testcase<Array<any>> & {
        array: 'is' | 'is not'
        data: ExceptionDataDTO
      }

      const cases: Case[] = [
        {
          array: 'is',
          data: { errors: [ERROR] },
          expected: [ERROR]
        },
        {
          array: 'is not',
          data: { errors: ERROR },
          expected: [ERROR]
        }
      ]

      cases.forEach(({ array, data, expected }) => {
        it(`should be array if dto.data.errors ${array} array`, () => {
          // Act
          const Subject = new TestSubject(undefined, undefined, data)

          // Expect
          expect(Subject.errors).to.include.deep.ordered.members(expected)
        })
      })
    })

    describe('#message', () => {
      type Case = Testcase<string> & {
        be: 'be' | 'not be'
        data: ExceptionDataDTO
        defined: 'defined' | 'not defined'
        message: string | undefined
      }

      const cases: Case[] = [
        {
          be: 'be',
          data: { message: ERROR.message },
          defined: 'defined',
          expected: ERROR.message,
          message: undefined
        },
        {
          be: 'not be',
          data: {},
          defined: 'not defined',
          expected: TestSubject.DEFAULT_MESSAGE,
          message: TestSubject.DEFAULT_MESSAGE
        }
      ]

      cases.forEach(({ be, data, defined, expected, message }) => {
        it(`should ${be} overridden if dto.data.message is ${defined}`, () => {
          // Act
          const result = new TestSubject(undefined, message, data)

          // Expect
          expect(result.message).to.equal(expected)
        })
      })
    })

    describe('#name', () => {
      it('should set #name to "Exception"', () => {
        expect(new TestSubject().name).to.equal('Exception')
      })
    })
  })

  describe('.formatCode', () => {
    type Case = Testcase<ExceptionCode> & { code: any }

    const cases: Case[] = [
      { code: -1, expected: ExceptionCode.INTERNAL_SERVER_ERROR },
      ...Object.keys(ExceptionId).map(id => ({
        code: ExceptionCode[id],
        expected: ExceptionCode[id] as ExceptionCode
      }))
    ]

    cases.forEach(({ code, expected }) => {
      it(`should return ${expected} given [${code}]`, () => {
        expect(TestSubject.formatCode(code)).equal(expected)
      })
    })
  })

  describe('.fromSequelizeError', () => {
    it.skip('should convert SequelizeError into Exception', () => {
      //
    })
  })

  describe('.idByCode', () => {
    type Case = Testcase<ExceptionId> & { code: any }

    const cases: Case[] = [
      { code: -1, expected: ExceptionId.INTERNAL_SERVER_ERROR },
      ...Object.keys(ExceptionId).map(id => ({
        code: ExceptionCode[id],
        expected: id as unknown as ExceptionId
      }))
    ]

    cases.forEach(({ code, expected }) => {
      it(`should return '${expected}' given [${code}]`, () => {
        expect(TestSubject.idByCode(code)).equal(expected)
      })
    })
  })

  describe('#toJSON', () => {
    it('should return json representation of Exception', () => {
      // Arrange
      const code = ExceptionCode.I_AM_A_TEAPOT
      const data = { errors: { test: true }, foo: '' }
      const message = 'Test error message'

      // Act + Expect
      expect(new TestSubject(code, message, data).toJSON()).deep.equal({
        className: ExceptionClassName.I_AM_A_TEAPOT,
        code,
        data: { foo: data.foo, isExceptionJSON: true },
        errors: [data.errors],
        message,
        name: ExceptionId.I_AM_A_TEAPOT,
        stack: undefined
      })
    })
  })

  describe('get status', () => {
    it('should return current ExceptionCode', () => {
      // Arrange
      const expected = ExceptionCode.INTERNAL_SERVER_ERROR

      // Act + Expect
      expect(new TestSubject().status).to.equal(expected)
    })
  })
})
