import type MochaAssertionResult from './mocha-assertion-result.type'

/**
 * @file Global Test Types - MochaTestResult
 * @module tests/utils/types/MochaTestResult
 */

/**
 * Object representing a top level {@link Mocha.Suite} test result summary.
 */
type MochaTestResult = {
  assertion_results: MochaAssertionResult[]
  file: NonNullable<Mocha.Test['file']>
  is_pending: ReturnType<Mocha.Suite['isPending']>
  mocha_id: string
  title: Mocha.Suite['title']
}

export default MochaTestResult
