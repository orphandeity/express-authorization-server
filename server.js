require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')

const { authenticateToken } = require('./lib/middleware')

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
