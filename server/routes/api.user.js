"use strict"

var express           = require('express')
  , User              = require("../models/user")
  , db                = require("../database").db
  , jwt               = require("jsonwebtoken")
  , Hash              = require('../utils').hash
  , router            = express.Router()
  , nodemailer        = require('nodemailer')
  , smtpTransport     = require('nodemailer-smtp-transport')
  , validEmail        = require('../utils').validEmail
  , moment            = require('moment')
  , handlebars        = require('handlebars')
  , bcrypt            = require('bcrypt-nodejs')
  , fs                = require('fs-promise')
  , configEmail       = require("../config/email")
  , sendActivation    = require("../emails/auth").sendAccountActivationEmail
  , sendRenewPwd      = require("../emails/auth").sendRenewPasswordAccess
  , sendValidRenewPwd = require("../emails/auth").sendValidRenewPassword
  , helpers           = require("./helpers")
  , Path              = require("path")
  , Q                 = require("q")
  , expressJwt        = require("express-jwt")
  , KEY               = require("../config/auth").key
  , ROOTCLIENT        = require("../config/main").urlRootClient // Url Client Root
  , DOMAIN            = require("../config/main").domain

// Registration Routes / Controllers
router.post('/', signup)
router.get('/setadmin/:id', setAdmin)
router.get('/authnewpass', expressJwt({secret:KEY}), authnewpass)
router.get('/renewpassstart', renewpassstart)
router.post('/renewpass', expressJwt({secret:KEY}), renewpass)
router.post('/renewpasschange', expressJwt({secret:KEY}), renewpasschange)
router.post('/validate', expressJwt({secret:KEY}), validate)

module.exports = router

function getuser (req, res) {
  res.json({action:" GET one user"})
}

function authnewpass(req, res) {

  var hash = (!!req.user.hash ? req.user.hash : false)

  if (!!hash){
    // get informations user
    User.find({"hash": hash}, function(err, docs, user, tokenJWT) {
      if (!!err) throw err
      if (!!docs) {
        user = docs[0]

        // get Hash and send new token
        tokenJWT = jwt.sign({
            expiresIn : "1d"
          , email : user.email
          , hash : hash
        }, KEY)

        res.json({"token" : tokenJWT})
      }
    })
  }
}

// Start procedure to change password
function renewpassstart(req, res) {

  var tokenJWT = jwt.sign({
      expiresIn : "1d"
  }, KEY)

  // just control origin of request and send an new token
  if (req.hostname === DOMAIN)
    res.json({"token" : tokenJWT})
  else
    res.sendStatus(401)
}

// send an token for access to form To change password
function renewpass(req, res){
    var emailControlled,
          verif = new validEmail

  if (!!req.body.email) {
    emailControlled = verif.control(req.body.email)

    if (!!emailControlled && !!req.body.step && req.body.step === 1) {

            // generate a new token if email is correct
            User.find(
              {email : emailControlled}
            , function (err, docs, user, token, newH) {
                if (!!docs.length) {
                  user = docs[0]
                  if (!!user.active) {

                    // renew hash
                    newH = Hash.generate()

                    User.update({"_id" : user._id}, {"hash" : newH}, function(err, stats){
                      if(!!err) throw(err)

                      if(!!stats.ok) {

                        token = jwt.sign({
                            expiresIn : "1d"
                          , email : user.email
                          , hash : newH
                        }, KEY)

                        // send email with an new token with hash in link
                        sendRenewPwd(user.email, token).then(sendOk, errorHandler)

                        function sendOk() {
                          res.json({"valid" : 1})
                        }

                        function errorHandler(err) {
                          console.log(err)
                          res.sendStatus(500)
                        }
                      }

                    })

                  } else
                    res.json({"error" : "Your acccount is not actived, you can't change the password"})

                } else
                  res.sendStatus(401)
              }
            )
    }
    else
      res.sendStatus(401)
  } else
    res.sendStatus(401)

}

// Validation to change password (verify synchro hash + update bdd)
function renewpasschange(req, res) {
  if (!!req.body && !!req.user) {
    // 1. control data
    var mail = req.user.email
    var h = req.user.hash
    var newPass = req.body.pwd
    var newPassConfirm = req.body.vpwd

    if (newPass != newPassConfirm)
      res.json({"error" : "The password confirm is not same than the password. Please confirm your new password"})

    User.find(
      {hash : h}
    , function (err, docs, user, nPass) {
        if (!!docs.length) {
          user = docs[0]

          if (!!user.active) {
            nPass = bcrypt.hashSync(newPass)

            if (user.pass === nPass || user.oldPass == nPass)
              res.json({"error" : "Your new password is same that old password. Please, could you to choose an other password"})

            User.update(
              { "_id" : user._id }
              , {
                  pass : nPass
                , oldPass : user.pass
              }
              , function(err, stats) {

                if(!!err) throw(err)

                if(!!stats.ok) {
                  // Send email : To inform the user that his password has been changed
                  sendValidRenewPwd(user.email).then(sendOk, errorHandler)

                  function sendOk() {
                    // TODO : remove hash of account for more secure process

                    res.json({"valid" : 1})
                  }

                  function errorHandler(err) {
                    console.log(err)
                    res.sendStatus(500)
                  }

                }
              }
            )

          } else {
            res.json({"error" : "Your acccount is not actived, you can't change the password"})
          }
        }
      }
    )

  }
}


function validate(req, res) {

  if (!!req.user) {
    var hash = req.user.hash
    var mail = req.user.email

    // find user
    User.find({email:mail}, function (err, docs, user) {
      if (!!docs.length) {
          user = docs[0]

        if (user.hash == hash && !user.active) {
          User.update({"hash":hash}, {"active" : true}, function(){
            res.json({msg : "Your account is validated now. You can log in our website"})
          })
        } else
          res.json({msg: "Your account have already actived"})
      }
      else
        res.json({msg : "You don't have an account. Be sure to have one for validate it."})
    })
  } else {
    console.log("Error : Not body on this request")
    res.sendStatus(401)
  }
}

/////////////////////////////////////////////////////////
///////////  SET ADMIN [GET _id]  ///////////
/////////////////////////////////////////////////////////
function setAdmin(req, res) {

  if(!req.params.id)
    res.sendStatus(401)

  console.log("set this _id : ", req.params.id);

  User.update({"_id" : req.params.id}, {"level" : 666}, function(err, stats){
    if(!!err) console.log("HORROR : ",err)

    if(!!stats.ok)
      res.json({msg:"This user has been updated on Admin level"})
     else
      res.sendStatus(401)
  })



}
///////////////////////////////////////////////

function signup(req, res) {
  var newHash = Hash.generate()
  var verif = new validEmail
  var emailValid = verif.control(req.body.email)

  if(!emailValid)
    res.sendStatus(401)

  var passValid = req.body.pwd // TODO ; control password formats
  var passEncrypt = bcrypt.hashSync(passValid)

  var data = {
      email : emailValid
    , pass: passEncrypt
    , hash : newHash
    , startDate : moment().format()
    , active : 'false'
    , level : '1'
  }

  // if (sessionStorage.getItem('isAdmin'))
  //   data.passAdmin = Hash.generate()

  var user = new User(data)

  user.save(function (err, tokenJWT, emailModel) {

    if (err)
      res.json({error : err})

    // create a new token for validate account
    tokenJWT = jwt.sign({
        expiresIn : "2d"
      , hash : newHash
      , email : emailValid
    }
    , KEY)

    sendActivation(emailValid, tokenJWT).then(onsuccess, onerror)

    function onerror(err){
    console.log("err : ",err);
    }

    function onsuccess(){
    res.json({msg : "Your account has been created"})
    }

  })
}
