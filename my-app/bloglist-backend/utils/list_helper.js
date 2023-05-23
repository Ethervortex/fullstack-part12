const _ = require('lodash')
const User = require('../models/user') // Tehtävä 4.16

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
  ? 0
  : blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const fav = blogs.reduce((eniten, blog) => {
    return eniten.likes > blog.likes ? eniten : blog
  })
  return {
    title: fav.title,
    author: fav.author,
    likes: fav.likes
  }
}

const mostBlogs = (blogs) => {
  const authorC = _.countBy(blogs, 'author')
  const authorB = _.map(authorC, (laskuri, author) => ({author, blogs: laskuri}))
  return _.maxBy(authorB, 'blogs')
}

const mostLikes = (blogs) => {
  const ryhmittely = _.groupBy(blogs, 'author')
  const tykkayksia = _.mapValues(ryhmittely, (blogs) => {
    return _.sumBy(blogs, 'likes')
  })
  const eniten = _.maxBy(_.keys(tykkayksia), (author) => {
    return tykkayksia[author]
  })
  return {
    author: eniten,
    likes: tykkayksia[eniten]
  }
}

// Tehtävä 4.16
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes, usersInDb
}