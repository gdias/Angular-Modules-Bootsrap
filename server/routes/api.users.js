"use strict"

var express = require('express')
  , router = express.Router()
  , User = require("../models/user")
  , Field = require("../models/sandbox").form

function getAllUsers(req, res) {

  // Sb.find({}, function (err, docs) {
  //     res.json(docs)
  // })

  User.find({}, function (err, docs) {
      res.json(docs)
  })
}




router.get('/', getAllUsers)
// router.get('/getField/:group', getAllFieldValues)
// router.post('/addField', addFormField)

module.exports = router
