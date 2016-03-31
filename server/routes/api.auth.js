"use strict"

var express     = require('express')
  , router      = express.Router()
  , User        = require("../models/user")
  , db          = require("../database").db
  , hash        = require('../utils').hash
  , key         = require("../config/auth").key



module.exports.auth = function(req, res, em, pw) {

  em = req.body.email
  pw = req.body.pwd

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
        // TODO : errorHandler
      }
  })

  router.get('/', expressJwt({secret:key}), function(req, res) {
    //console.log("/get >",req.body)
    res.sendStatus(200)
  })

}
