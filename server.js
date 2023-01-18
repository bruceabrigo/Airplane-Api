
require('dotenv').config() 
const express = require('express') 
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')
const Airplane = require('./models/airplane')

const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose.connect(DATABASE_URL, CONFIG)

mongoose.connection
  .on('open', () => console.log("Connected to Mongoose"))
  .on('close', () => console.log("Disconnected from Mongoose"))
  .on('error', (error) => console.log(error))

const app = express()

app.use(morgan('tiny')) 
app.use(express.urlencoded({ extended: true })) 
app.use(express.static('public')) 
app.use(express.json())

app.get("/", (req, res) => {
  res.send('Server running...')
})

/* -- Create Routes -- */
app.get('/', (req, res) => {
  res.send('Server is now live')
})

app.get('/airplanes/seed', (req, res) => {
  const initialPlanes = [
    {manufacturer: 'Airbus', model: 'A350', airline: 'Delta', airborne: true},
    {manufacturer: 'Boeing', model: '737-800', airline: 'Southwest', airborne: true},
    {manufacturer: 'Boeing', model: '787-800', airborne: 'United', airborne: false},
    {manufacturer: 'Airbus', mode: 'A320-Neo', airline: 'Air Canada', airborne: true}
  ]

  Airplane.deleteMany({})
  .then(() => {
    Airplane.create(initialPlanes)
    .then(data => res.json(data))
    .catch(error => console.log(`Error occurred: ${error}`))
  })
})

/* -- Display All Aircraft's -- */
app.get('/airplanes', (req, res) => {
  Airplane.find({})
    .then(airplanes => {res.json({airplanes: airplanes})})
    .catch(error => console.log(`Error occurred: ${error}`))
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Port connection: ${PORT}`))
