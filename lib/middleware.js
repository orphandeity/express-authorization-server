const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
  // get auth header from request
  const authHeader = req.headers['authorization']
  // separate token from Bearer in auth header
  const token = authHeader && authHeader.split(' ')[1]
  // if token is null, return unauthorized status
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // if token is invalid, return forbidden status
    if (err) return res.sendStatus(403)
    // if token is valid, set user to request object and continue
    req.user = user
    next()
  })
}

module.exports = {
  authenticateToken
}
