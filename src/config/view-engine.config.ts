import { create } from 'express-handlebars'
import path from 'path'

/**
 * @file Configuration - viewEngine
 * @module sneusers/config/viewEngine
 */

export default create({
  /** @see https://github.com/ericf/express-handlebars/pull/249 */
  defaultLayout: null as unknown as string,
  extname: '.hbs',
  partialsDir: path.join(process.cwd(), 'views', 'partials')
})
