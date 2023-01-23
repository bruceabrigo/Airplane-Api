const express = require('express') 
const Airplane = require('../models/airplane')
require('dotenv').config()

const router = express.Router()

/* ---------------------- INDEX ---------------------- */

router.get('/', (req, res) => {
  const { username, loggedIn, userId } = req.session

  Airplane.find({})
    .populate('owner', 'username')
    .then(planes => {
      res.render('planes/index', {planes, username, loggedIn, userId})
    })
    .catch(err => {
      console.log(err)
      res.redirect(`/error?error=${err}`)
    })
})

/* ---------------------- Creates New Craft ---------------------- */


router.get('/new', (req, res) => { //error need fixing come back
  res.render('planes/new', { ...req.session })
})

router.post('/', (req, res) => {
  req.body.owner = req.session.userId
  Airplane.create(req.body)
    .then((airplane) => {
      console.log('New plane added: \n', airplane)
      res.redirect('/airplanes')
    })
    .catch((err) => {
      res.redirect(`/error?error=${err}`)
    })
})

/* -- POST (create new plane) -- */
router.post('/', (req, res) => {
  req.body.owner = req.session.userId
  const newPlane = req.body
  Airplane.create(newPlane)
      .then(planes => {
          res.status(201).json({planes: planes.toObject()})
      })
      .catch(err => {
          console.log(err)
          res.redirect(`/error?error=${err}`)
        })
})

/* ---------------------- Shows User Specific Crafts ---------------------- */

router.get('/mine', (req, res) => {
  Airplane.find(({owner: req.session.userId}))
  .populate('owner', 'username')
    .then((planes) => {
      res.render('planes/index', {planes, ...req.session})
    })
    .catch(err => {
      console.log(err)
      res.redirect(`/error?error=${err}`)
    })
})

router.get('/edit/:id', (req,res) => {
  const planeId = req.params.id
  Airplane.findById(planeId)
    .then(planes => {
      res.render('planes/edit', {planes, ...req.session})
    })
    .catch(err => {
      res.redirect(`/error?error=${err}`)
    })
})

/* ---------------------- Request Updated User Specific Crafts ---------------------- */

router.get('/edit/:id', (req, res) => {
  const airplaneId = req.params.id
  Airplane.find(airplaneId)
    .then(planes => {
      res.render('planes/edit', {planes, ...req.session})
    })
    .catch(err => {
      res.redirect(`/error?error=${err}`)
    })
})

/* ---------------------- UPDATE (user specific aircraft) ------------------------*/
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
            res.redirect(`/error?error=${err}`)
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

// router.get('/:id', (req, res) => {
//   const id = req.params.id
//   Airplane.findById(id)
//     .then(airplanes => {
//       res.json({airplanes: airplanes})
//     })
//     .catch(err => {
//       console.log(err)
//       res.status(404).json(err)
//     })
// })

/* ---------------------- Shows User Specific Crafts ---------------------- */
router.get('/:id', (req, res) => {
  const planeId = req.params.id
  Airplane.findById(planeId)
    .then((plane) => {
      console.log('we found: \n', plane)
      res.render('planes/show', {plane, ...req.session})
    })
    .catch((err) => {
      console.log(err)
      res.json({err})
    })
})

module.exports = router