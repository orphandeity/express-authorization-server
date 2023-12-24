const bcrypt = require('bcrypt')

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
  stripUser
}
