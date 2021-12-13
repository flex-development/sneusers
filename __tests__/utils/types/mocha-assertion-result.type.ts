import type { OrUndefined } from '@flex-development/tutils'
import type MochaTestResult from './mocha-test-result.type'

/**
 * @file Global Test Types - MochaAssertionResult
 * @module tests/utils/types/MochaAssertionResult
 */

/**
 * Object representing a {@link Mocha.Test} result summary.
 */
type MochaAssertionResult = {
  body: Mocha.Test['body']
  current_retry: number
  duration: Mocha.Test['duration']
  err: Mocha.Test['err'] | null
  failure_messages: string[]
  file: MochaTestResult['file']
  full_title: ReturnType<Mocha.Test['fullTitle']>
  is_pending: ReturnType<Mocha.Test['isPending']>
  mocha_id: string
  parent: OrUndefined<{ full_title: string; mocha_id: string }>
  speed: Mocha.Test['speed']
  state: Mocha.Test['state']
  status: Exclude<Mocha.Test['state'], undefined> | 'pending'
  title: Mocha.Test['title']
  title_path: ReturnType<Mocha.Test['titlePath']>
}

export default MochaAssertionResult
