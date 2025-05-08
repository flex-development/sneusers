/**
 * @file Entry Point - Database
 * @module sneusers/database
 */

export { default } from '#database/database.module'
export {
  default as InjectMapper
} from '#database/decorators/inject-mapper.decorator'
export {
  default as IsTimestamp
} from '#database/decorators/is-timestamp.decorator'
export { default as Entity } from '#database/entities/base.entity'
export type { default as IDocument } from '#database/interfaces/document'
export { default as Mapper } from '#database/providers/base.mapper'
export { default as Repository } from '#database/providers/base.repository'
export type { default as DatabaseRecord } from '#database/types/database-record'
export type { default as EntityData } from '#database/types/entity-data'
