/**
 * @file Unit Tests - RxJSProvider
 * @module sneusers/providers/tests/unit/RxJSProvider
 */

import { RXJS } from '#src/tokens'
import * as rxjs from 'rxjs'
import TestSubject from '../rxjs.provider'

describe('unit:providers/RxJSProvider', () => {
  it('should provide RXJS', () => {
    expect(TestSubject).to.have.property('provide').deep.equal(RXJS)
  })

  it('should use value rxjs', () => {
    expect(TestSubject).to.have.property('useValue').deep.equal(rxjs)
  })
})
