const bcrypt = require('bcrypt')

function passwordHash(password) {
  const salt = bcrypt.genSaltSync()
  return bcrypt.hashSync(password, salt)
}

function passwordCompare(password, hash) {
  return bcrypt.compareSync(password, hash)
}

module.exports = {
  passwordHash,
  passwordCompare
}
