const knex = require('../connection')

function createUser({ username, password }) {
  return knex('users')
    .insert({
      username,
      password,
      avatar: `https://robohash.org/${username}?set=set4&size=128x128`,
      role: 'user'
    })
    .returning('*')
}

function getUserByUsername(username) {
  return knex('users').where({ username }).first()
}

module.exports = {
  createUser,
  getUserByUsername
}
