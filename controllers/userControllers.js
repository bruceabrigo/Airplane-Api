const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const Airplane = require('../models/airplane')

const router = express.Router()

/* ---------------------- Handles SIGNUP ---------------------- */

router.get('/signup', (req, res) => {
  res.render('users/signup')
})

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
      res.redirect('/users/login')
    })
    .catch(err => {
      console.log(err)
      res.redirect(`/error?error=username%20taken`)
    })
})

/* ---------------------- Handles LOGIN ---------------------- */

router.get('/login', (req, res) => {
  res.render('users/login')
})

// post user login to db
router.post('/login', async (req, res) => {
  // find username and password input
  const {username, password} = req.body
  // verify's and authenticates user login created previously
  // compare user input to stored users on db
  User.findOne({username})
    .then(async (user) => {
      if(user) {
        const result = await bcrypt.compare(password, user.password)
        // if result is true (user input can be verified) then allow user access to stored user info
        if(result) {
          req.session.username = username
          req.session.loggedIn = true
          req.session.userId = user.id
          // send 201 no context status if result can be matched
          res.redirect('/')
        } else {
          res.json({error: 'user and pass do not match'})
        }
      }
    })
    .catch(err => {
      console.log(err)
      res.json(err)
    })
    
})

/* -- DELETE Owner Login -- */
// create logout function
// 'logout' by ending current user session 

router.delete('/logout', (req, res) => {
  req.session.destroy(() => { //destroys current session
    res.sendStatus(204)
  })
})


module.exports = router