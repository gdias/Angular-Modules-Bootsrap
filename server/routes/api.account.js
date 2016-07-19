"use strict"

var express         = require('express')
  , router          = express.Router()
  , jwt             = require("jsonwebtoken")
  , User            = require("../models/user")
  , validEmail      = require("../utils").validEmail
  , validPwd        = require("../utils").validPwd
  , sendChangeEmail = require("../emails/account").sendEmailChangeEmail
  , sendChangePwd   = require("../emails/account").sendEmailChangePwd
  , Hash            = require('../utils').hash
  , expressJwt      = require("express-jwt")
  , KEY             = require("../config/auth").key


router.post('/edit/email', expressJwt({secret:KEY}), updateEmail)
router.get('/edit/email/valid', expressJwt({secret:KEY}), validUpdateEmail)

router.post('/edit/pwd', expressJwt({secret:KEY}), updatePassword)
router.post('/edit/pwd/valid', expressJwt({secret:KEY}), validUpdatePassword)



function validUpdateEmail(req, res) {

    // req.user.email
    var verif = new validEmail
    var emailControlled = verif.control(req.user.email)

    if (!!emailControlled && req.user && req.user.hash) {

      // get user by Hash
      User.update({"hash" : req.user.hash}, {"email" : emailControlled}, function(err, stats){
        if(!!err) console.log("HORROR : ",err)

        if(!!stats.ok) {
          var token = jwt.sign({
              expiresIn : "7d"
            , username : emailControlled
          }
          , KEY)

          res.sendStatus(200)
          console.log("Your email contact has been updated")
        } else
          res.sendStatus(500)

      })

    }

}

function updateEmail(req, res){
  var emailControlled, newHash, tokenJWT,
      verif = new validEmail


  if (!!req.body && !!req.body.email) {
    emailControlled = verif.control(req.body.email)

    if(emailControlled) {
      // sendChangeEmail
      newHash = Hash.generate()

      tokenJWT = jwt.sign({
          expiresIn : "1d"
        , email : emailControlled
        , hash : newHash
      }
      , KEY)

      // update hash for current user
      User.update({"email" : req.user.username}, {"hash" : newHash}, function(err, stats) {
        if(!!err) console.log("HORROR : ",err)

        if(!!stats.ok)
          console.log("An new hash has been saved")

      })

      sendChangeEmail(emailControlled, tokenJWT).then(success, fail)

      function success() {
        res.json({msg:"An email has been send to new email adress"})
      }

      function fail(err) {
        console.log("err : ",err);
        res.sendStatus(401)
      }

    }
  }


  res.sendStatus(200)
}

function updatePassword(req, res) {
  var pwdControlled, newHash, tokenJWT, id

  id = req.user.id



  newHash = Hash.generate()

  tokenJWT = jwt.sign({
      expiresIn : "1d"
    , pwd : pwdControlled
    , hash : newHash
  }
  , KEY)

  // pwdControlled
  // sendEmailChangePwd
  // sendChangeEmail(emailControlled, tokenJWT).then(success, fail)


  res.sendStatus(200)
}

function validUpdatePassword(req, res) {

  res.sendStatus(200)
}



module.exports = router
