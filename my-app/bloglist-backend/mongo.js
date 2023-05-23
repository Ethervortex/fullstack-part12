const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@bw0.6lrcsii.mongodb.net/testBlogApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  // id: Number,
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

if (process.argv.length === 3) {
  console.log('blogs:')
  Blog.find({}).then(res => {
    res.forEach(blog => {
      console.log(`${blog.title} ${blog.author}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 7) {
  const blog = new Blog({
    title: process.argv[3],
    author: process.argv[4],
    url: process.argv[5],
    likes: process.argv[6]
  })
  blog.save().then(res => {
    console.log(`added ${blog.title} author ${blog.author} to bloglist`)
    mongoose.connection.close()
  })
}
