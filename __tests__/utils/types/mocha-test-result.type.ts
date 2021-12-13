import type MochaAssertionResult from './mocha-assertion-result.type'

/**
 * @file Global Test Types - MochaTestResult
 * @module tests/utils/types/MochaTestResult
 */

/**
 * Object representing a top level {@link Mocha.Suite} test result summary.
 */
type MochaTestResult = {
  __mocha_id__: string
  assertionResults: MochaAssertionResult[]
  file: NonNullable<Mocha.Test['file']>
  isPending: ReturnType<Mocha.Suite['isPending']>
  title: Mocha.Suite['title']
}

export default MochaTestResult
