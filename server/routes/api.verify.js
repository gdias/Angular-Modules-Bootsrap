"use strict"

var express = require('express')
  , router = express.Router()

function verifyEmail(req, res, email){
  if (!!req.body && !!req.body.email) {
    email = req.body.email
    User.find({"email" : email}, function (err, docs, resultTest) {
        resultTest = !!docs.length
        res.json(resultTest)
    })
  }
}

router.get("/email", verifyEmail)

module.exports = router
