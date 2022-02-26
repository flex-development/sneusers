import type { DatabaseTable } from '../../enums'

/**
 * @file DatabaseModule Utilities (Types) - formatTableColumn
 * @module sneusers/modules/db/utils/formatTableColumn/types
 */

export type FormattedTableColumn = `${DatabaseTable}.${string}`
