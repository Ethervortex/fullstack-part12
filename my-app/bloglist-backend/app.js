const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users') // Tehtävä 4.15
const loginRouter = require('./controllers/login') // Tehtävä 4.18
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor) // Tehtävä 4.20

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter) // Tehtävä 4.15
app.use('/api/login', loginRouter) // Tehtävä 4.18

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app