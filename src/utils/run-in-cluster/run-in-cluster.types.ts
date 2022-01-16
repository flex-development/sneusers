import type { OrPromise } from '@flex-development/tutils'

/**
 * @file Utility Type Definitions - runInCluster
 * @module sneusers/utils/runInCluster/types
 */

/**
 * Function to run in child clusters.
 */
export type ChildClusterFn = (...args: any[]) => OrPromise<void>
