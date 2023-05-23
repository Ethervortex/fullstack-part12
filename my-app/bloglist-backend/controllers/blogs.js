const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user') // Tehtävä 4.17
const jwt = require('jsonwebtoken') // Tehtävä 4.19
const middleware = require('../utils/middleware') // Tehtävä 4.22
//const logger = require('../utils/logger')

/* Tehtävä 4.19
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
} */

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog // Tehtävä 4.17
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// Tehtävä 4.10 ja 4.12
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  // Tehtävä 4.19:
  // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  //const user = await User.findById(decodedToken.id)
  const user = request.user // Tehtävä 4.22
  //const users = await User.find({}) // Tehtävä 4.17
  //const user = users[0]
  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Title or URL is missing' })
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes || 0
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id) // 4.17
  await user.save()
  response.status(201).json(savedBlog)
})

// Tehtävä 4.21
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (decodedToken.id.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'unauthorized' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  //const user = await User.findById(decodedToken.id)
  const user = request.user // Tehtävä 4.22
  user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString())
  await user.save()

  response.status(204).end()
})

/* Tehtävä 4.13
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
}) */

// Tehtävä 4.14
blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const updateBlog = {
    likes: body.likes
  }
  const updated = await Blog.findByIdAndUpdate(request.params.id, updateBlog, { new: true })
  response.json(updated)
})
/*
blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
}) 

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
}) */

module.exports = blogsRouter