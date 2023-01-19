const express = require('express') 
const Airplane = require('../models/airplane')

const router = express.Router()

/* -- INDEX -- */
router.get('/', (req, res) => {
  Airplane.find({})
    .then(planes => {res.json({planes: planes})})
    .catch(err => {
      console.log(err)
      res.status(404).json(err)
    })
})

/* -- CREATE  -- */
router.post('/', (req, res) => {
  req.body.owner = req.session.userId
  const newPlane = req.body
  Airplane.create(newPlane)
      // send a 201 status, along with the json response of the new fruit
      .then(planes => {
          res.status(201).json({planes: planes.toObject()})
      })
      // send an error if one occurs
      .catch(err => {
          console.log(err)
          res.status(404).json(err)
      })
})

/* -- CREATE Owner -- */


module.exports = router