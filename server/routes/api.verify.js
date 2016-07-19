"use strict"

var express = require('express')
  , expressJwt = require("express-jwt")
  , router = express.Router()
  , User = require("../models/user")
  , KEY = require("../config/auth").key
  , bcrypt = require('bcrypt-nodejs')


router.post("/email", verifyEmailExist)
router.post("/pwd", expressJwt({secret:KEY}), verifyPwdCorrect)

function verifyEmailExist(req, res, email){
  if (!!req.body && !!req.body.email) {

    email = req.body.email

    User.find({"email" : email}, function (err, docs, resultTest) {
        resultTest = !!docs.length
        res.json(resultTest)
    })
  }
}

function verifyPwdCorrect(req, res) {

    // console.log('foo BODY ;> ',req.body)
    // console.log('foo USER :> ',req.user)

    if (!!req.user && !!req.user.id) {

        var passTest = req.body.pwd
        var currentPwdCrypt = ""

        User.find({'_id' : req.user.id}, function(err, docs){

            if (!err && !!passTest) {
                currentPwdCrypt = docs[0].pass

                if(bcrypt.compareSync(passTest, currentPwdCrypt))
                    res.sendStatus(200) // right pwd
                else
                    res.sendStatus(403) // bad pwd

            } else {
                res.sendStatus(500)
            }
        })
    } else
        res.sendStatus(500)

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
