const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const router = express.Router()

router.post('/signup', async (req, res) => {
  // create user variable from request body
  const newUser = req.body
  // use mongoose method to create newUser
  // use bcrypt to encrypt user password on signup
  newUser.password = await bcrypt.hash(
    newUser.password,
    await bcrypt.genSalt(10)
  )
  User.create(newUser)
    .then(user => {
      res.status(201).json({username: user.username})
    })
    .catch(err => {
      console.log(err)
      res.json(err)
    })
})

module.exports = router