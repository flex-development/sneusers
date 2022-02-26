import MAGIC_NUMBER from '@fixtures/magic-number.fixture'
import type {
  IsOption,
  Testcase,
  TestcaseDecoratorValidation
} from '@tests/utils/types'
import type { ValidationArguments } from 'class-validator'
import TestSubject from '../is.constraint'

/**
 * @file Unit Tests - IsConstraint
 * @module sneusers/constraints/tests/unit/IsConstraint
 */

describe('unit:constraints/IsConstraint', () => {
  let subject: TestSubject

  before(() => {
    subject = new TestSubject()
  })

  describe('#defaultMessage', () => {
    type Case = Omit<Testcase, 'expected'> & {
      constraints: ValidationArguments['constraints']
      description: RegExp
      type: string
      value: ValidationArguments['value']
    }

    const cases: Case[] = [
      {
        constraints: [{ types: ['boolean'] }],
        description: /type must be one of/,
        type: 'null',
        value: null
      },
      {
        constraints: [{ each: true, types: ['string'] }],
        description: /must be of type/,
        type: 'number',
        value: [MAGIC_NUMBER]
      }
    ]

    cases.forEach(({ constraints, description, type, value }) => {
      const matches = `${description} and /received: ${type}/`

      it(`should return message matching ${matches}`, () => {
        // Arrange
        constraints[0].context = { [TestSubject.NAME]: { error: { type } } }
        const args = { constraints, value }

        // Act
        const result = subject.defaultMessage(args as ValidationArguments)

        // Expect
        expect(result).to.match(description)
        expect(result).to.match(new RegExp(`received: ${type}`))
        expect(result).to.match(new RegExp(`[${args.constraints[0].types}]`))
      })
    })
  })

  describe('#validate', () => {
    type Case = TestcaseDecoratorValidation<boolean, IsOption> & {
      args: Pick<ValidationArguments, 'constraints' | 'value'>
    }

    const cases: Case[] = [
      {
        args: { constraints: [{}], value: null },
        expected: false,
        option: 'no options'
      },
      {
        args: { constraints: [{ types: ['boolean'] }], value: [MAGIC_NUMBER] },
        expected: false,
        option: 'options.types'
      },
      {
        args: { constraints: [{ types: ['number'] }], value: MAGIC_NUMBER },
        expected: true,
        option: 'options.types'
      }
    ]

    cases.forEach(({ args, expected, option }) => {
      it(`should return ${expected} given ${args.value} and ${option}`, () => {
        // Act
        const result = subject.validate(args.value, args as ValidationArguments)

        // Expect
        expect(result).to.equal(expected)
      })
    })
  })
})
