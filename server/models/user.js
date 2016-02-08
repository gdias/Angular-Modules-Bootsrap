"use strict"

var mongoose     = require('mongoose')
  , Schema       = mongoose.Schema
  , UserShema

UserShema = new Schema({
      email: String
    , username : String
    , pass : String
    , datetime : String
    , lastConnection : String
    , active : Boolean
})

module.exports = mongoose.model('User', UserShema)
