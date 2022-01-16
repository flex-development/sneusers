import cluster from 'cluster'
import os from 'os'
import { ChildClusterFn } from './run-in-cluster.types'

/**
 * @file Utilities - runInCluster
 * @module sneusers/utils/runInCluster/impl
 */

/**
 * Launches a cluster of Node.js processes.
 *
 * The main process will create a child process for each core in the CPU.
 *
 * The cluster works as a load balancer; child processes share server ports and
 * work under the same address.
 *
 * @see https://wanago.io/2019/04/29/node-js-typescript-power-of-many-processes-cluster
 *
 * @template T - Child cluster function
 *
 * @param {ChildClusterFn} fn - Function to run in child clusters
 * @param {Parameters<T>} [args=[]] - `fn` arguments
 * @return {Promise<void>} Nothing when complete
 */
async function runInCluster<T extends ChildClusterFn = ChildClusterFn>(
  fn: T,
  ...args: Parameters<T>
): Promise<void> {
  if (!cluster.isPrimary) return await fn(...args)
  for (let i = 0; i < os.cpus().length; ++i) cluster.fork()
}

export default runInCluster
