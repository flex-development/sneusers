/**
 * @file Unit Tests - RxJSProvider
 * @module sneusers/providers/tests/unit/RxJSProvider
 */

import { RXJS } from '#src/tokens'
import * as rxjs from 'rxjs'
import TestSubject from '../rxjs.provider'

describe('unit:providers/RxJSProvider', () => {
  describe('.provide', () => {
    it('should provide RXJS', () => {
      expect(TestSubject).to.have.property('provide').deep.equal(RXJS)
    })
  })

  describe('.useValue', () => {
    it('should use rxjs', () => {
      expect(TestSubject).to.have.property('useValue').deep.equal(rxjs)
    })
  })
})
