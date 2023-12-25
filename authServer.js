require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const redis = require('redis')

const { authenticateToken } = require('./lib/middleware')
const { getUserByUsername } = require('./db/queries/users')
const {
  passwordCompare,
  stripUser,
  getRefreshTokenFromStore
} = require('./lib/utils')

const port = process.env.AUTH_PORT || 4000
const app = express()

app.use(express.json())

// redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
})

redisClient.on('connect', () => {
  console.log('Redis client connected')
})

redisClient.on('error', (err) => {
  console.error('Redis error: ', err)
})

redisClient.on('end', () => {
  console.log('Connection to Redis ended')
  // Reconnect logic can be implemented here
})

/**
 * DELETE /logout
 *
 * Delete refresh token from Redis and remove user info from request object
 */
app.delete('/logout', authenticateToken, async (req, res) => {
  await redisClient.connect()
  await redisClient.del(String(req.user.id), (err, response) => {
    if (err) {
      console.error('Error deleting refresh token from Redis: ', err)
      return res.sendStatus(500)
    } else {
      console.log('Redis response: ', response)
    }
  })
  await redisClient.disconnect()
  req.user = null
  res.sendStatus(204)
})

/**
 * POST /token
 *
 * Generate new access token using refresh token
 */
app.post('/token', authenticateToken, async (req, res) => {
  // check request body for refresh token
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401) // unauthorized

  // check if refresh token passed by user matches the stored value
  const storedToken = await getRefreshTokenFromStore(req.user.id, redisClient)
  if (storedToken === refreshToken) {
    // refresh token is valid
    // verify refresh token and generate new access token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403) // forbidden
      // user object must be stripped of properties added by jwt.sign()
      const accessToken = generateAccessToken(stripUser(user))
      return res.json({ accessToken })
    })
  } else {
    // refresh token is invalid
    return res.sendStatus(403) // forbidden
  }
})

/**
 * POST /login
 *
 * Authenticate user and generate access token and refresh token
 */
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

  // store refresh token in redis
  await redisClient.connect()
  await redisClient.set(String(user.id), refreshToken)
  await redisClient.disconnect()

  // send access token to client
  res.json({ accessToken, refreshToken })
})

function generateAccessToken(user) {
  // generate temporary access token with user object and secret key
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
