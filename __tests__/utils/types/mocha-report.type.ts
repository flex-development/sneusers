import type MochaAssertionResult from './mocha-assertion-result.type'
import type MochaTestResult from './mocha-test-result.type'

/**
 * @file Global Test Types - MochaReport
 * @module tests/utils/types/MochaReport
 */

/**
 * Object representing output from our custom json spec reporter.
 */
type MochaReport = {
  readonly results: MochaTestResult[]
  readonly suites: (Pick<Mocha.Suite, 'root' | 'title'> & {
    parent: MochaAssertionResult['parent']
  })[]
  readonly stats: Mocha.Stats
}

export default MochaReport
