
require('dotenv').config() 
const express = require('express') 
const morgan = require('morgan')
const path = require('path')
const AirplaneRouter = require('./controllers/planeControllers')
const UserRouter = require('./controllers/userControllers')
const middleware = require('./utils/middleware')

const app = require('liquid-express-views')(express())
middleware(app)

/* -- Create Routes -- */
app.get('/', (req, res) => {
  const {username, loggedIn, userId} = req.session
  // res.send("Your server is running, better go out and catch it")
  res.render('home.liquid', {username, loggedIn, userId})
})


app.use('/airplanes', AirplaneRouter)
app.use('/users', UserRouter)

app.get('/error', (req, res) => {
  const error = req.query.error || 'This page does not exist'
  const {username, loggedIn, userId} = req.session
  res.render('errorHandler.liquid', { error, username, loggedIn, userId})
})

app.all('*', (req, res) => {
  res.redirect('/error')
})

/* -- Server Handler -- */
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Port connection: ${PORT}`))
