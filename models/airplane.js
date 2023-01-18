const mongoose = require('mongoose') // import mongoose

// we'll destructure the schema and model functions from mongoose
const { Schema, model } = mongoose

// fruits schema
const airplaneSchema = new Schema({
  manufacturer: String,
  airline: String,
  airborne: Boolean
})

// make fruit model 
// the model method takes two arg
// the first is what we call our model
// the second is the schema used to build the model
const Airplane = model('airplane', airplaneSchema)

/* -------------------------------------- */
/// Export our model                     ///
/* -------------------------------------- */
module.exports = Airplane