"use strict"

var express = require('express')
  , router = express.Router()

function getAllUsers(req, res) {
  User.find({}, function (err, docs) {
      res.json(docs)
  })
}

router.get('/', getAllUsers)

module.exports = router
