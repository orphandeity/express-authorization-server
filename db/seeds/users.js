const knex = require('../connection.js')
const { passwordHash } = require('../../lib/utils')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('users').del()
  await knex('users').insert([
    {
      username: 'admin',
      password: passwordHash('p@ssword1234'),
      avatar: `https://robohash.org/admin?set=set4&size=150x150`,
      role: 'admin'
    },
    {
      username: 'user',
      password: passwordHash('password'),
      avatar: `https://robohash.org/user?set=set4&size=150x150`,
      role: 'user'
    },
    {
      username: 'guest',
      password: passwordHash('password'),
      avatar: `https://robohash.org/guest?set=set4&size=150x150`,
      role: 'guest'
    }
  ])
}
