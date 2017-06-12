"use strict"

var mongoose     = require('mongoose')
  , Schema       = mongoose.Schema
  //, sb , ageSchema , sexeSchema, originSchema

// sb = new Schema({
//   age : String
// , sexe : String
// , origin : String
// })
//
// sexeSchema = new Schema(["homme", "femme", "couple", "trans M", "trans F"])
// ageSchema =  new Schema(["18-25", "25-35", "35-45","45+"])
// originSchema =  new Schema(["Européen", "Africain", "Asiatique", "Indien"])


//module.exports.sandbox = mongoose.model('sandbox', sb)

// module.exports.sexe = mongoose.model('sexe', sexeSchema)
// module.exports.age = mongoose.model('age', ageSchema)
// module.exports.origin = mongoose.model('origin', originSchema)


var fieldSchema = new Schema({
    group : String
  , value : String
  , order : Number
})

// var formSchema = new Schema({
//   sexe : [fieldSchema]
//   , age : [fieldSchema]
//   , origin : [fieldSchema]
//   , morpho : [fieldSchema]
// })

module.exports.form = mongoose.model('form', fieldSchema)



//
// var fieldBase = {
//   sexe : [
//     {
//       _id : "",
//       key : "male_key"
//     }
//     , {
//       _id : "",
//       key : "female_key"
//     }
//   ],
//   ageRange : [
//     {
//       _id : ""
//       value : "18-25"
//     }
//   ]
//
// }
