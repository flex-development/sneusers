import type MochaTestResult from './mocha-test-result.type'

/**
 * @file Global Test Types - MochaAssertionResult
 * @module tests/utils/types/MochaAssertionResult
 */

/**
 * Object representing a {@link Mocha.Test} result summary.
 */
type MochaAssertionResult = {
  __mocha_id__: string
  body: Mocha.Test['body']
  currentRetry: number
  duration: Mocha.Test['duration']
  err: Mocha.Test['err'] | null
  failureMessages: string[]
  file: MochaTestResult['file']
  fullTitle: ReturnType<Mocha.Test['fullTitle']>
  isPending: ReturnType<Mocha.Test['isPending']>
  parent: { __mocha_id__: string; fullTitle: string } | undefined
  speed: Mocha.Test['speed']
  state: Mocha.Test['state']
  status: Exclude<Mocha.Test['state'], undefined> | 'pending'
  title: Mocha.Test['title']
  titlePath: ReturnType<Mocha.Test['titlePath']>
}

export default MochaAssertionResult
