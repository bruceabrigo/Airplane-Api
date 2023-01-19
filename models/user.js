const mongoose = require('../utils/connection')

const {Schema, model} = mongoose

// create new user Schema
// store in an object
// require key values
const userSchema = new Schema ({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

const User = model('user', userSchema)
module.exports = User