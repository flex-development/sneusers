import type { QueryInterface } from 'sequelize'

/**
 * @file Global Test Types - BulkDeleteResponse
 * @module tests/utils/types/BulkDeleteResponse
 */

/**
 * Return type of {@link QueryInterface#bulkDelete}.
 */
type BulkDeleteResponse = ReturnType<QueryInterface['bulkDelete']>

export default BulkDeleteResponse
