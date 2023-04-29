/**
 * @file Unit Tests - ValidationProvider
 * @module sneusers/providers/tests/unit/ValidationProvider
 */

import { ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import TestSubject from '../validation.provider'

describe('unit:providers/ValidationProvider', () => {
  describe('.provide', () => {
    it('should provide APP_PIPE', () => {
      expect(TestSubject).to.have.property('provide').deep.equal(APP_PIPE)
    })
  })

  describe('.useValue', () => {
    it('should use ValidationPipe instance', () => {
      expect(TestSubject)
        .to.have.property('useValue')
        .be.instanceof(ValidationPipe)
    })
  })
})
