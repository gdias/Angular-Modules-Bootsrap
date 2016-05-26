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
  , KEY               = require("../config/auth").key
  , ROOTCLIENT        = require("../config/main").urlRootClient // Url Client Root
  , DOMAIN            = require("../config/main").domain

module.exports.getuser = function (req, res) {
  res.json({action:" GET one user"})
}

module.exports.allusers = function (req, res) {
  User.find({}, function (err, docs) {
      res.json(docs)
  })
}

module.exports.authnewpass = function(req, res) {
  console.log("user ::> ", req.user);
  var hash = (!!req.user.hash ? req.user.hash : false)

  if (!!hash){
    // get informations user
    User.find({"hash": hash}, function(err, docs, user, tokenJWT) {
      if (!!err) throw err
      if (!!docs) {
        user = docs[0]
        console.log("user : ",user);
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
module.exports.renewpassstart = function(req, res) {

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
module.exports.renewpass = function(req, res){
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


module.exports.renewpasschange = function(req, res) {
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
// Service method
module.exports.verifyEmail = function(req, res, email){
  if (!!req.body && !!req.body.email) {
    email = req.body.email
    User.find({"email" : email}, function (err, docs, resultTest) {
        resultTest = !!docs.length
        res.json(resultTest)
    })
  }
}

module.exports.validate = function(req, res) {
  console.log("validate : ", req.user);
  if (!!req.user) {
    var hash = req.user.hash
    var mail = req.user.email

    // find user
    User.find({email:mail}, function (err, docs, user) {
      if (!!docs.length) {
          user = docs[0]
          console.log("user finded ",user)

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

///////////////////////////////////////////////
///////////  SET ADMIN [GET _id]  ////////////
///////////////////////////////////////////////
module.exports.setAdmin = function(req, res) {

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

module.exports.user = function(req, res) {
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


      //
      // emailModel = {
      //   template : {
      //       name : "email_activate"
      //     , content : {
      //         header_text : "Welcome !"
      //     //, footer_text : "Custom Footer"
      //       , body : {
      //           title : "You must active your account for continue !"
      //         , text : "For activate your account, you must just click on the next button."
      //         , button : {
      //             link : [ROOTCLIENT, "validateAccount/" ,tokenJWT].join("")
      //           , text : "Activer votre compte"
      //         }
      //       }
      //     }
      //   }
      //   , send : {
      //       from: configEmail.sender
      //     , to: emailValid
      //     , subject: '[IMPORTANT] - Activate your registration and continue on our website, welcome !',
      //   }
      // }
      //
      // helpers.sendEmail(emailModel).then(onsuccess, onerror)

      function onerror(err){
        console.log("err : ",err);
      }

      function onsuccess(){
        res.json({msg : "Your account has been created"})
      }

  })
}
