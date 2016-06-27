"use strict"

var express = require('express')
  , expressJwt = require("express-jwt")
  , router = express.Router()
  , User = require("../models/user")
  , KEY = require("../config/auth").key


//router.post("/email/different", expressJwt({secret:KEY}), verifyNewEmailSameCurrent)
router.post("/email", verifyEmailExist)


function verifyEmailExist(req, res, email){
  if (!!req.body && !!req.body.email) {

    email = req.body.email

    User.find({"email" : email}, function (err, docs, resultTest) {
        resultTest = !!docs.length
        res.json(resultTest)
    })
  }
}

//
// function verifyNewEmailSameCurrent(req, res) {
//   if(!!req.body && req.user) {
//
//     var oldE = req.user.username
//     var newE = req.body.testNewEmail
//
//     if (!!oldE && !!newE)
//       res.json({"same" : (oldE === newE ? true : false)})
//     else
//       res.sendStatus(500)
//
//   } else {
//     res.sendStatus(401)
//   }
// }

module.exports = router
