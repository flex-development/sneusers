import { IsOptional, IsString, IsUrl } from 'class-validator'

/**
 * @file Models - ServerInfo
 * @module sneusers/models/ServerInfo
 */

/**
 * Object containing OpenAPI server documentation.
 *
 * @see https://swagger.io/docs/specification/api-host-and-base-path
 */
class ServerInfo {
  /**
   * Server description.
   */
  @IsString()
  @IsOptional()
  description?: string

  /**
   * Server url.
   */
  @IsUrl()
  url: string

  /**
   * Creates a new `ServerInfo` object.
   *
   * @param {string} [url] - Server url
   * @param {string} [description] - Server description
   */
  constructor(url: string = '', description?: string) {
    this.description = description
    this.url = url
  }
}

export default ServerInfo
