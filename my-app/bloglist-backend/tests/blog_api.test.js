const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

// Tehtävä 4.9
const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

let token = null
let id = null

beforeEach(async () => {
  // Tehtävä 4.23:
  await User.deleteMany({})
  const user = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpassword',
  }
  await api
    .post('/api/users')
    .send(user)
    .expect(201)
  const response = await api.post('/api/login').send({
    username: 'testuser',
    password: 'testpassword'
  })
  token = response.body.token

  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are correct number of blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

// Tehtävä 4.9
test('name of the id field is correct', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
})

// Tehtävä 4.10
test('a valid blog can be added with post', async () => {
  const newBlog = {
    title: 'How to play Guitar',
    author: 'Alexi Laiho',
    url: 'https://www.guitar.com',
    likes: 1
  }
  const vastaus = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) // Tehtävä 4.23
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.title)
  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(contents).toContain('How to play Guitar')
})

// Tehtävä 4.11
test('if likes field missing, likes=0', async () => {
  const newBlog = {
    title: 'How to make money',
    author: 'George Soros',
    url: 'https://www.money.com',
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) // Tehtävä 4.23
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  const lastBlog = response.body[response.body.length - 1]
  //console.log(lastBlog)
  expect(lastBlog.likes).toBe(0)
})

test('if title or url is missing, status 400 is returned', async () => {
  const newBlog = {
    author: 'George Soros',
    likes: 0
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) // Tehtävä 4.23
    .send(newBlog)
    .expect(400)
})

test('remove the added blog', async () => {
  const newBlog = {
    title: 'How to play Guitar',
    author: 'Steve Vai',
    url: 'https://www.steve.com',
    likes: 1
  }
  const vastaus = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) // Tehtävä 4.23
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  id = vastaus.body.id
  const allBlogs = await api.get('/api/blogs')
  console.log(id)
  await api
    .delete(`/api/blogs/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
  
  const afterDelete = await api.get('/api/blogs')
  //console.log(afterDelete.body)
  expect(afterDelete.body).toHaveLength(allBlogs.body.length - 1)
})

test('increase likes of the first blog by 1', async() => {
  const allBlogs = await api.get('/api/blogs')
  const toBeUpdated = allBlogs.body[0]
  //console.log(toBeUpdated.likes)
  const updatedBlog = { ...toBeUpdated, likes: toBeUpdated.likes + 1 }
  const response = await api
    .put(`/api/blogs/${toBeUpdated.id}`)
    .set('Authorization', `Bearer ${token}`) // Tehtävä 4.23
    .send(updatedBlog)
    .expect(200)
  //console.log(response.body.likes)
  expect(response.body.likes).toBe(toBeUpdated.likes + 1)
})

test('trying to add blog with invalid token', async () => {
  const newBlog = {
    title: 'How to play Guitar',
    author: 'Steve Vai',
    url: 'https://www.guitar.com',
    likes: 2
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer invalidtoken`) // Tehtävä 4.23
    .send(newBlog)
    .expect(401)
})

afterAll(async () => {
  await mongoose.connection.close()
})