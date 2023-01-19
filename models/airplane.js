const mongoose = require('../utils/connection') // import mongoose

// we'll destructure the schema and model functions from mongoose
const { Schema, model } = mongoose

// fruits schema
const airplaneSchema = new Schema({
  manufacturer: {
    type: String
  },
  model: {
    type: String
  },
  airline: {
    type: String
  },
  airborne: {
    type: Boolean
  },
  taxiStatus: {
    type: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
}, {timestamps: true})

// make fruit model 
// the model method takes two arg
// the first is what we call our model
// the second is the schema used to build the model
const Airplane = model('airplane', airplaneSchema)

/* -------------------------------------- */
/// Export our model                     ///
/* -------------------------------------- */
module.exports = Airplane