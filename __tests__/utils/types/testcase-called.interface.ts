import type Testcase from './testcase.interface'

/**
 * @file Global Test Types - TestcaseCalled
 * @module tests/utils/types/TestcaseCalled
 */

/**
 * Object representing a [`callCount`][1] test case.
 *
 * [1]: https://github.com/domenic/sinon-chai
 */
interface TestcaseCalled extends Testcase<number> {
  call: 'call' | 'not call'
}

export default TestcaseCalled
