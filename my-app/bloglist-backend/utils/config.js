require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.NODE_ENV === 'test' // Tehtävä 4.8
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}