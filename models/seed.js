const mongoose = require('../utils/connection')
const Airplane = require('./airplane')

const db = mongoose.connection

db.on('open', () => {
  const initialPlanes = [
    {manufacturer: 'Airbus', model: 'A350', airline: 'Delta', airborne: true},
    {manufacturer: 'Boeing', model: '737-800', airline: 'Southwest', airborne: true},
    {manufacturer: 'Boeing', model: '787-800', airline: 'United', airborne: false},
    {manufacturer: 'Airbus', mode: 'A320-Neo', airline: 'Air Canada', airborne: true}
  ]

  Airplane.deleteMany({owner: null})
    .then(() => {
      Airplane.create(initialPlanes)
        .then(data => {
          console.log('here are the created fruits: \n', data)
          db.close()
        })
        .catch(err => {
          console.log('The following error occurred: \n', err)
          db.close()
      })
    })
    .catch(err => {
      console.log(err)
      db.close()
    })
})