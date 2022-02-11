declare module 'chai' {
  import type { ExceptionCode } from '@flex-development/exceptions/enums'
  import type { HttpStatus } from '@nestjs/common'

  global {
    export namespace Chai {
      interface Assertion {
        each(fn: (item: Chai.Assertion, index: number) => any): Chai.Assertion
        jsonResponse(
          status?: HttpStatus | ExceptionCode,
          body?: 'array' | 'object'
        ): Chai.Assertion
      }
    }
  }
}
