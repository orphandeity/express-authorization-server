require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const { getUserByUsername } = require('./db/queries/users')
const { passwordCompare, stripUser } = require('./lib/utils')

const port = process.env.AUTH_PORT || 4000
const app = express()

app.use(express.json())

let refreshTokens = []

app.get('/list', (req, res) => {
  res.json({ refreshTokens })
})

app.delete('/logout', (req, res) => {
  // remove refresh token from memory
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
  res.sendStatus(204) // no content
})

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  // check if refresh token exists
  if (refreshToken == null) return res.sendStatus(401) // unauthorized
  // check if refresh token is valid
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403) // forbidden
  // verify refresh token and generate new access token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    // if token is invalid, return forbidden status
    if (err) return res.sendStatus(403) // forbidden
    // if token is valid, generate new access token and send it to client
    // user object must be stripped of properties added by jwt.sign()
    const accessToken = generateAccessToken(stripUser(user))
    res.json({ accessToken })
  })
})

app.post('/login', async (req, res) => {
  // authenticate user
  const { username, password } = req.body
  if (!username || !password) return res.sendStatus(400) // bad request
  // check if user exists
  let user = await getUserByUsername(username)
  if (!user) return res.sendStatus(401) // unauthorized
  // check if password is correct
  const match = passwordCompare(password, user.password)
  if (!match) return res.sendStatus(401) // unauthorized

  // strip user object of sensitive data
  user = stripUser(user)
  // generate access token with automatic expiration
  const accessToken = generateAccessToken(user)
  // generate refresh token with no expiration
  // refresh token management will be handled manually
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  // store refresh token in memory
  refreshTokens.push(refreshToken)
  // send access token to client
  res.json({ accessToken, refreshToken })
})

function generateAccessToken(user) {
  // generate temporary access token with user object and secret key
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '25s' })
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
