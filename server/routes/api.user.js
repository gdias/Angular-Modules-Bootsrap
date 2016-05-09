"use strict"

var express           = require('express')
  , User              = require("../models/user")
  , db                = require("../database").db
  , jwt               = require("jsonwebtoken")
  , Hash              = require('../utils').hash
  , router            = express.Router()
  , key               = require("../config/auth").key
  , nodemailer        = require('nodemailer')
  , smtpTransport     = require('nodemailer-smtp-transport')
  , validEmail        = require('../utils').validEmail
  , moment            = require('moment')
  , handlebars        = require('handlebars')
  , bcrypt            = require('bcrypt-nodejs')
  , fs                = require('fs-promise')
  , configEmail       = require("../config/email")
  , helpers       = require("./helpers")
  , Path              = require("path")
  , Q                 = require("q")
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

module.exports.authnewpass = function(req, res, hash) {
  hash = (!!req.user.hash ? req.user.hash : false)
  if (hash){
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
        }, key)

        res.json({"token" : tokenJWT})
      }
    })
  }
}


module.exports.renewpassstart = function(req, res) {

  console.log(">>> req.fresh ", req.fresh);
  console.log(">>> req.xhr ", req.xhr);

  //console.log(" --> ", req.hostname," === ",DOMAIN)

  var tokenJWT = jwt.sign({
      expiresIn : "1d"
  }, key)

  console.log("token secure for renew pass : ", tokenJWT)
  // just control origin of request and send an new token

  if (req.hostname === DOMAIN)
    res.json({"token" : tokenJWT})
  else
    res.sendStatus(401)

}

module.exports.renewpass = function(req, res){
  var emailControlled,
      verif = new validEmail
    //  console.log("content type > ", req.get('Content-Type'));
    //  console.log("body > ",req.body)

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
                        }, key)

                        res.json({"token" : token})

                        // http://localhost:8080/#renewPassword/valid/[TOKEN]

                        // send email with an new token with hash in link

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
    , key)

    emailModel = {
        template : {
            name : "email_activate"
          , content : {
              header_text : "Welcome !"
            , footer_text : "YOLO !! FUCK ME ! "
            , body : {
                title : "You must active your account for continue !"
              , text : "For activate your account, you must just click on the next button."
              , button : {
                  link : [ROOTCLIENT, "validateAccount/" ,tokenJWT].join("")
                , text : "Activer votre compte"
              }
            }
          }
        }
        , send : {
            from: configEmail.sender
          , to: emailValid
          , subject: '[IMPORTANT] - Activate your registration and continue on our website, welcome !',
        }
      }

      helpers.sendEmail(emailModel).then(onsuccess, onerror)

      function onerror(err){
        console.log("err : ",err);
      }

      function onsuccess(){
        res.json({msg : "Your account has been created"})
      }

  })
}
