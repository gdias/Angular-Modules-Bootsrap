"use strict"

var express     = require('express')
  , router      = express.Router()
  , User        = require("../models/user")
  , jwt         = require("jsonwebtoken")
  , db          = require("../database").db
  , hash        = require('../utils').hash
  , key         = require("../config/auth").key
  , bcrypt      = require('bcrypt-nodejs')
  , expressJwt  = require("express-jwt")


module.exports.auth = function(req, res) {
  
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
            }, key)

            res.json(tokenJWT)
          }
          else
            res.json({error:'Account not validated'})

        } else {
          res.json({error:'Bad password'})
        }
      } else {
        res.json({error:'Please, create an account'})
      }
  })
}


module.exports.authValid = function (req, res) {
    console.log("/get >",req.body)

    res.sendStatus(200)
}
