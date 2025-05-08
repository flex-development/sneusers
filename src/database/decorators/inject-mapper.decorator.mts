/**
 * @file Decorators - InjectMapper
 * @module sneusers/database/decorators/InjectMapper
 */

import { Inject } from '@nestjs/common'

/**
 * Inject a data mapper.
 *
 * @decorator
 *
 * @this {void}
 *
 * @param {{ name: string }} Entity
 *  Database entity model
 * @return {ClassDecorator}
 *  Parameter decorator
 */
function InjectMapper(
  this: void,
  Entity: { name: string }
): ParameterDecorator {
  return Inject(Entity.name + 'Mapper')
}

export default InjectMapper
