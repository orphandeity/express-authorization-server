const knex = require('../connection')

function getUserByUsername(username) {
  return knex('users').where({ username }).first()
}

module.exports = {
  getUserByUsername
}
