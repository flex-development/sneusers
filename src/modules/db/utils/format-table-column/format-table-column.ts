import { DatabaseTable } from '../../enums'
import { FormattedTableColumn } from './format-table-column.types'

/**
 * @file DatabaseModule Utilities - formatTableColumn
 * @module sneusers/modules/db/utils/formatTableColumn/impl
 */

/**
 * Formats a table column name.
 *
 * @param {DatabaseTable} table_name - Table name
 * @param {string} column_name - Column name
 * @return {FormattedTableColumn} Formatted table column name
 */
const formatTableColumn = (
  table_name: DatabaseTable,
  column_name: string
): FormattedTableColumn => `${table_name}.${column_name}`

export default formatTableColumn
