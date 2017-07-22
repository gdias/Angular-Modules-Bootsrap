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
  , moment            = require("moment")
  , User              = require("../models/user")
  , sendActivation    = require("../emails/auth").sendAccountActivationEmail


router.get('/', expressJwt({secret:KEY}), authValid)
router.get('/admin', expressJwt({secret:KEY}), adminVerif)
router.post('/', auth)
router.post('/rae', expressJwt({secret:KEY}), resendActivateEmail)

function adminVerif(req, res) {

  if (!!req.user)
    User.find({"_id":req.user.id}, function(err, docs){
      var level = docs[0].level
      if(!!level)
        res.json(level === 666 ? true : false)
      else
        res.sendStatus(500)
    })

}


function auth (req, res) {

    if (!req.body)
        res.sendStatus(500)

    var em = req.body.email
    var pw = req.body.pwd

  // check email
  User.find({email:em}, function (err, docs, passCrypted, tokenJWT) {

      if(!!docs.length){
        passCrypted = (docs[0].pass.length < 10 ? bcrypt.hashSync(docs[0].pass) : docs[0].pass)

        if(bcrypt.compareSync(pw, passCrypted)) {

          if (!!docs[0].active) {
            var userID = docs[0]._id;

            tokenJWT = jwt.sign({
                expiresIn : "7d"
              , id : userID
              , username : req.body.email
            }, KEY)



            User.update(
                { 'email' : docs[0].email }
              , { 'lastConnection' : moment().format() }
                , function(err, stats){
                   if(!!err)
                      console.log("HORROR : ",err)
                      
                   if(!!stats.ok)
                    res.json(tokenJWT)
                }
            )

          } else {
            // create an other token for validate account
            tokenJWT = jwt.sign({
                expiresIn : "2d"
              , hash : docs[0].hash
              , email : docs[0].email
            }
            , KEY)

            res.json({type:2, token:tokenJWT, error:'Account not validated'})
          }

        } else
          res.json({type:1, error:'Bad password'})

      } else
        res.json({type:0, error:'Please, create an account'})
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
    //console.log("/get USER with param>",req.user)

    // TODO : control data
    // if not good data
    // remove auth and redirect by angular at Home


    res.sendStatus(200)
}


module.exports = router
