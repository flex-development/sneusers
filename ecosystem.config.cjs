const pkg = require('./package.json')

/**
 * @file PM2 Configuration
 * @see https://pm2.keymetrics.io/docs/usage/application-declaration
 */

module.exports = {
  apps: [
    {
      name: pkg.name.split('/')[1],
      script: './dist/main.js',
      watch: true,
      ignore_watch: ['node_modules']
    }
  ]
}
