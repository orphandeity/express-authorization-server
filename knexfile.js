const path = require('node:path')
const basePath = path.join(__dirname, 'db')

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.join(basePath, 'sqlite.db')
    },
    useNullAsDefault: false,
    migrations: {
      directory: path.join(basePath, 'migrations')
    },
    seeds: {
      directory: path.join(basePath, 'seeds')
    }
  }
}
