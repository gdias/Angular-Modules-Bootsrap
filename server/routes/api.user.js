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
  , Path              = require("path")
  , Q                 = require("q")
  , BASE              = "localhost:8080/#/"

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

module.exports.renewpass = function(req, res, emailControlled, verif){

  verif = new validEmail

  if (!!req.body.email) {
    emailControlled = verif.control(req.body.email)

    if (!!emailControlled && !!req.body.step) {

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
                  res.send(401)

              }
            )
    }
    else
      res.send(401)
  } else
    res.send(401)

}

module.exports.verifyEmail = function(req, res, email){
  if (!!req.body && !!req.body.email) {
    email = req.body.email

    User.find({"email" : email}, function (err, docs) {
        res.json(docs)
    })
  }
}


module.exports.validate = function(req, res, hash, mail) {

  if (!!req.user) {
    hash = req.user.hash
    mail = req.user.email

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
  }
}

module.exports.user = function(req, res) {

  var newHash = Hash.generate()
  var verif = new validEmail
  var emailValid = verif.control(req.body.email)

  if(!emailValid)
    res.send(401)

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
  var user = new User(data)

  user.save(function (err) {

    if (err)
      res.json({error : err})

    // create a new token for validate account
    var tokenJWT = jwt.sign({
        expiresIn : "2d"
      , hash : newHash
    }
    , key)

    var objEmail = {
        mail : emailValid
      , token : tokenJWT
    }

    // contruct email for activate account
    constructEmailValidateAccount(objEmail).then(onsuccess, onerror)

    function onerror(err){
      console.log("err : ",err);
    }

    function onsuccess(htmlEmail, nodemailerData){

      nodemailerData = {
        from: configEmail.sender,
        to: emailValid,
        subject: '[IMPORTANT] - Activate your registration and continue on our website, welcome !',
        html: htmlEmail
      }

      var options = {
          host: 'localhost',
          port: 25
      }

      var transporter = nodemailer.createTransport(smtpTransport(options))

      transporter.verify(function(error, success) {
         if (error) {
              console.log(error);
         } else {
              console.log('Server is ready to take our messages');
         }
      });

      transporter.sendMail(nodemailerData, function(error, info){
        if(error)
            return console.log(error);

        console.log('Message sent: ' + info.response);
      })

    }

    res.json({token : tokenJWT})

  })
}



// construct Email : Validate account
var constructEmailValidateAccount = function (dataEmail, deferred) {

  deferred = Q.defer()

  if (!dataEmail)
    deferred.reject("no data")

  loadtemplate("footer", '/../hbs/commons/footer.hbs')
  .then(loadtemplate("header", '/../hbs/commons/header.hbs'))
  .then(loadtemplate("body", '/../hbs/email_activate.hbs'))
  .then(function(){

    fs.readFile(__dirname + '/../hbs/index.hbs', 'utf8', function(err, data, model, tmpl){
      if (err)
        deferred.reject(err)

      if (!!data){

        // create a new Model for generate the activate email
        model = {
          header_text : "test Header text"
          , footer_text : "test Footer text"
          , title_tag : "Title of page"
          , email : {
              title : "You must active your account !"
            , text : "For activate your account, just click on the next button."
            , button : {
                link : [BASE, "validateAccount/" ,dataEmail.token].join("")
              , text : "Activer votre compte"
            }
          }
        }

        for(var i in dataEmail)
          model[i] = dataEmail[i]

        tmpl = handlebars.compile(data)

        deferred.resolve(tmpl(model))
      }
      else
        deferred.reject("no data")

    })
  })

  return deferred.promise
}

function loadtemplate(name, path, deferred) {
  deferred = Q.defer()

  if(!!path && !!name){
    var p = Path.normalize( __dirname + path)

    fs.readFile(p, 'utf8', function(err, data) {
      if (err)
      deferred.reject(err)

      handlebars.registerPartial(name, data)
      deferred.resolve(data)
    })

  }
  else
    console.error("HORROR")

  return deferred.promise
}
