import type { IsOptions } from '@sneusers/interfaces'
import type { ValidationOptions } from 'class-validator'
import type Testcase from './testcase.interface'

/**
 * @file Global Test Types - TestcaseDecoratorValidation
 * @module tests/utils/types/TestcaseDecoratorValidation
 */

/**
 * Represents a validation decorator or decorator constraint test case.
 *
 * @template Expected - Type of expected value
 * @template Option - Option names
 *
 * @extends Testcase<Expected>
 */
interface TestcaseDecoratorValidation<
  Expected = any,
  Option extends string | never = never
> extends Testcase<Expected> {
  option: 'no options' | (Option extends never ? never : `options.${Option}`)
}

/** Custom `Is` decorator option names */
export type IsOption = keyof Omit<IsOptions, keyof ValidationOptions>

export default TestcaseDecoratorValidation
