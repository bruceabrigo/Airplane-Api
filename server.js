
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
    {manufacturer: 'Boeing', model: '787-800', airline: 'United', airborne: false},
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
    .catch(err => console.log(`Error occurred: ${err}`))})


/* -- CREATE New Aircraft -- */
app.post('/airplanes', (req, res) => {
  const newPlane = req.body
  Airplane.create(newPlane)
    .then(plane => {
      res.status(201).json({plane:plane.toObject()})
    })
    .catch(err => console.log(`Error occurred: ${err}`))
})

/* -- UPDATE Existing Aircraft's -- */
app.put('/airplanes/:id', (req, res) => {
  const id = req.params.id
  const updatePlane = req.body

  Airplane.findByIdAndUpdate(id, updatePlane, {new: true})
    .then(plane => {
      console.log('The newly updated plane', plane)
      res.sendStatus(204)
    })
    .catch(err => console.log(err))
})

/* -- DELETE Existing Aircraft's -- */
app.delete('/airplanes/:id', (req, res) => {
  const planeId = req.params.id

  Airplane.findByIdAndRemove(planeId)
    .then(() => {
      res.sendStatus(204)
    })
    .catch(err => console.log(`Error occurred: ${err}`))
})

/* -- Server Handler -- */
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Port connection: ${PORT}`))
