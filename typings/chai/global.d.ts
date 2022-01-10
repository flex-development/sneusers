declare module 'chai' {
  import type { HttpStatus } from '@nestjs/common'
  import type { ExceptionCode } from '@sneusers/enums'

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
