const express = require('express') 
const Airplane = require('../models/airplane')

const router = express.Router()

/* -- INDEX -- */

router.get('/', (req, res) => {
  Airplane.find({})
    .then(planes => {res.json({planes: planes})})
    .catch(err => {
      console.log(err)
      res.status(404).json(err) //sends 404 status if link cannot be found
    })
})

/* -- POST (create new plane) -- */
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
          res.status(404).json(err) //sends 404 status if link cannot be found
      })
})

/* -- GET (user specific aircraft) -- */
// must be logged in to find aircraft's owned by the user
router.get('/loggedin', (req, res) => { // used /loggedin in url to find user specific crafts
  Airplane.find({owner: req.session.userId})
  .then(airplanes => {
    res.status(200).json({airplanes: airplanes})
  })
  .catch(err => {
    console.log(err)
    res.status(404).json(err) //sends 404 status if link cannot be found
  })
})

/* -- UPDATE (user specific aircraft) -- */
router.put('/:id', (req, res) => {
  const id = req.params.id
  Airplane.findById(id)
    .then(airplanes => {
      // if owner of fruit is logged in
      if(airplanes.owner == req.session.userId) {
        // updated and save the fruit
        res.sendStatus(204)
        // send success message
        return airplanes.updateOne(req.body)
      } else {
        // otherwise send 401 unauthorized status
        res.sendStatus(401)
      }
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({err})
    })
})

/* -- DELETE Aircraft IF user is logged on -- */
router.delete('/:id', (req, res) => {
  const id = req.params.id
  Airplane.findById(id)
    .then(airplanes =>{
      if(airplanes.owner == req.session.userId) { // authenticates that userId matches userId in current session
        res.sendStatus(204)
      } else {
        res.sendStatus(401)
      }
    })
    .catch(err => {
      console.log(err)
      res.json(400).json({err})
    })
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  Airplane.findById(id)
    .then(airplanes => {
      res.json({airplanes: airplanes})
    })
    .catch(err => {
      console.log(err)
      res.status(404).json(err)
    })
})

module.exports = router