"use strict"

var express           = require('express')
  , router            = express.Router()
  , User              = require("../models/user")
  , jwt               = require("jsonwebtoken")
  , db                = require("../database").db
  , hash              = require('../utils').hash
  , KEY               = require("../config/auth").key
  , bcrypt            = require('bcrypt-nodejs')
  , expressJwt        = require("express-jwt")
  , sendActivation    = require("../emails/auth").sendAccountActivationEmail


router.post('/', auth)
router.get('/', expressJwt({secret:KEY}), authValid)
router.post('/rae', expressJwt({secret:KEY}), resendActivateEmail)



function auth (req, res) {

  var em = req.body.email
  var pw = req.body.pwd

  // check email
  User.find({email:em}, function (err, docs, passCrypted, tokenJWT) {

      if(!!docs.length){
        passCrypted = (docs[0].pass.length < 10 ? bcrypt.hashSync(docs[0].pass) : docs[0].pass)

        if(bcrypt.compareSync(pw, passCrypted)) {

          if (!!docs[0].active) {

            tokenJWT = jwt.sign({
                expiresIn : "7d"
              , username : req.body.email
            }, KEY)

            res.json(tokenJWT)
          }
          else {
            // create an other token for validate account
            tokenJWT = jwt.sign({
                expiresIn : "2d"
              , hash : docs[0].hash
              , email : docs[0].email
            }
            , KEY)

            res.json({type:2, token:tokenJWT, error:'Account not validated'})
          }

        } else {
          res.json({type:1, error:'Bad password'})
        }
      } else {
        res.json({type:0, error:'Please, create an account'})
      }
  })
}

function resendActivateEmail (req, res) {

  if (!req.user || !req.user.hash || !req.user.email)
    errorHandler()

  // create a new token for validate account
  var tokenJWT = jwt.sign({
                    expiresIn : "2d"
                  , hash : req.user.hash
                  , email : req.user.email
                 }, KEY)

  // ReSend Email
  sendActivation(req.user.email, tokenJWT).then(sendOk, errorHandler)

  function sendOk() {
    res.json({valid : 1})
  }

  function errorHandler(){
    res.sendStatus(500)
  }

}

function authValid(req, res) {
    console.log("/get USER with param>",req.user)

    // TODO : control data
    // if not good data
    // remove auth and redirect by angular at Home


    res.sendStatus(200)
}


module.exports = router
