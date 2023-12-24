require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')

const port = process.env.PORT || 3000
const app = express()

app.use(express.json())

const posts = [
  {
    user_id: 1,
    title: 'Post 1'
  },
  {
    user_id: 1,
    title: 'Post 2'
  },
  {
    user_id: 3,
    title: 'hic sit possimus'
  },
  {
    user_id: 2,
    title: 'sed ex sapiente'
  },
  {
    user_id: 2,
    title: 'aut architecto repellat'
  }
]

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.user_id == req.user.id))
})

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
