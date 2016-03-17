"use strict"

var mongoose     = require('mongoose')
  , Schema       = mongoose.Schema
  , UserShema

UserShema = new Schema({
      email: String
    , username : String
    , pass : String
    , lastConnection : String
    , startDate : String
    , active : Boolean
    , level : Number
    , hash : String
})

module.exports = mongoose.model('User', UserShema)
