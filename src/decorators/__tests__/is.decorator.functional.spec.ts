import type { OneOrMany } from '@flex-development/tutils'
import validator from '@sneusers/constraints/is.constraint'
import type { IsOptions } from '@sneusers/interfaces'
import MAGIC_NUMBER from '@tests/fixtures/magic-number.fixture'
import type { IsOption, TestcaseDecoratorValidation } from '@tests/utils/types'
import { validateSync } from 'class-validator'
import TestSubject from '../is.decorator'

/**
 * @file Functional Tests - Is
 * @module sneusers/decorators/tests/functional/Is
 */

describe('functional:decorators/Is', () => {
  describe('validation', () => {
    type Property = OneOrMany<any>
    type Case = Omit<
      TestcaseDecoratorValidation<number, IsOption>,
      'expected'
    > & {
      options: IsOptions
    }

    describe('fails', () => {
      type CaseFail = Case & { value: Property }

      const cases: CaseFail[] = [
        {
          option: 'no options',
          options: {},
          value: null
        },
        {
          option: 'options.types',
          options: { types: ['Date'] },
          value: [MAGIC_NUMBER, 'foofoobaby@gmail.com']
        }
      ]

      cases.forEach(({ option, options, value }) => {
        it(`should fail given ${value} and ${option}`, () => {
          // Arrange
          class TestClass {
            @TestSubject(options)
            $property: CaseFail['value']

            constructor($property: TestClass['$property']) {
              this.$property = $property
            }
          }

          // Act
          const errors = validateSync(new TestClass(value))

          // Expect
          expect(errors).to.have.length(1)
          expect(errors[0].constraints![validator.NAME]).to.be.a('string')
        })
      })
    })

    describe('passes', () => {
      type CasePass = Case & { value: Property }

      const cases: CasePass[] = [
        {
          option: 'options.types',
          options: {
            each: true,
            types: [
              'bigint',
              'boolean',
              'null',
              'number',
              'string',
              'symbol',
              'undefined'
            ]
          },
          value: [MAGIC_NUMBER, true, 'string']
        }
      ]

      cases.forEach(({ option, options, value }) => {
        it(`should pass given ${value} and ${option}`, () => {
          // Arrange
          class TestClass {
            @TestSubject(options)
            $property: CasePass['value']

            constructor($property: TestClass['$property']) {
              this.$property = $property
            }
          }

          //  Act + Expect
          expect(validateSync(new TestClass(value))).to.have.length(0)
        })
      })
    })
  })
})
