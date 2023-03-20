/**
 * @file PM2 Configuration
 * @module config/pm2
 * @see https://pm2.keymetrics.io/docs/usage/application-declaration
 */

module.exports = {
  apps: [
    {
      interpreter: 'node',
      interpreter_args: '--enable-source-maps',
      name: require('./package.json').name.replace(/.+?\//, ''),
      script: './dist/main.mjs'
    }
  ]
}
