const bcrypt = require('bcrypt')

// get refresh token from Redis
async function getRefreshTokenFromStore(userId, client) {
  await client.connect()
  const token = await client.get(String(userId), (err) => {
    if (err) {
      console.error('Error getting refresh token from Redis: ', err)
    }
  })
  await client.disconnect()
  return token
}

// strip user object of sensitive data
function stripUser(user) {
  const { id, username, avatar, role } = user
  return { id, username, avatar, role }
}

function passwordHash(password) {
  const salt = bcrypt.genSaltSync()
  return bcrypt.hashSync(password, salt)
}

function passwordCompare(password, hash) {
  return bcrypt.compareSync(password, hash)
}

module.exports = {
  passwordHash,
  passwordCompare,
  stripUser,
  getRefreshTokenFromStore
}
