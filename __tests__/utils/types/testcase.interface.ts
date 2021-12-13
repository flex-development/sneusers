/**
 * @file Global Test Types - Testcase
 * @module tests/utils/types/Testcase
 */

/**
 * Object representing a test case.
 *
 * @template Expected - Type of expected value
 * @example
 *  type Case = Testcase<number> & { nums: number[]; target: number }
 *
 *  const cases: Record<number, Case> = {
 *    1: { expected: 4, nums: [-1, 0, 3, 5, 9, 12], target: 9 },
 *    2: { expected: -1, nums: [4, 5, 6, 7, 9], target: 2 },
 *    3: { expected: 0, nums: [5], target: 5 }
 *  }
 *
 *  function testSubject(nums: number[], target: number): number {
 *    // some work
 *  }
 *
 *  const stringify_test = (
 *    expected: Case['expected'],
 *    nums: Case['nums'],
 *    target: Case['target']
 *  ) => `${expected} given (${JSON.stringify(nums)}, ${target})`
 *
 *  Object.keys(cases).forEach(num => {
 *    const { expected, nums, target } = cases[num]
 *
 *    describe(`case ${num}`, () => {
 *      it(`should return ${stringify_test(expected, nums, target)}`, () => {
 *        expect(testSubject(nums, target)).toBe(expected)
 *      })
 *    })
 *  })
 */
interface Testcase<Expected = any> {
  expected: Expected
}

export default Testcase
