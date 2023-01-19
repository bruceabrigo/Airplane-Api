
require('dotenv').config() 
const express = require('express') 
const morgan = require('morgan')
const path = require('path')
const AirplaneRouter = require('./controllers/planeControllers')
const UserRouter = require('./controllers/userControllers')
const middleware = require('./utils/middleware')

const app = express()

middleware(app)

/* -- Create Routes -- */
app.get('/', (req, res) => {
  res.send('Server is now live')
})

app.use('/airplanes', AirplaneRouter)
app.use('/users', UserRouter)

/* -- Server Handler -- */
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Port connection: ${PORT}`))
