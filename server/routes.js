"use strict"

var express = require('express')
var router = express.Router()
var jwt = require("jsonwebtoken")
var expressJwt = require("express-jwt")

var db = require("./database").db
var User = require("./models/user")
var hash = require('./utils').hash
var validEmail = require('./utils').validEmail

var moment = require('moment')

var bcrypt = require('bcrypt-nodejs')
var nodemailer = require('nodemailer')

// middleware
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// auth


// API Routes
router.get('/', function(req, res) {
  res.json({api : 'API work !'})
})

router.post('/auth', function(req, res) {
//  console.log("request  /auth ! : ",req.body);

  var em = req.body.email
  var pw = req.body.pwd

  // check email
  User.find({email:em}, function (err, docs) {

      if(!!docs.length){
      //  console.log("bcrypt : ",bcrypt.hashSync(docs[0].pass));
      //  console.log(docs[0].pass);
        var passCrypted = (docs[0].pass.length < 10 ? bcrypt.hashSync(docs[0].pass) : docs[0].pass)

        if(bcrypt.compareSync(pw, passCrypted)) {
          var token = jwt.sign({
              expiresIn : "7d"
            , username : req.body.email
          }, "ilovecats")
          res.json(token)
        } else {
          res.json({error:'Bad password'})
        }
      } else {
        res.json({error:'You can create an account'})
        // TODO : errorHandler
      }
  })

  router.get('/auth', expressJwt({secret:"ilovecats"}), function(req, res) {
    //console.log("/get >",req.body)
    res.sendStatus(200)
  })
})

router.get('/users', function(req, res) {
  User.find({}, function (err, docs) {
      res.json(docs)
  })

  // console.log("--- generate hash ---");
  // hash.generate()
  // console.log("--- date ---");
  //var time =
  //console.log("time : ",time);
})

router.post('/verify/email', function(req, res, email){
  if (!!req.body && !!req.body.email) {
    //console.log("email searched :: ",req.body.email);
    email = req.body.email

    User.find({"email" : email}, function (err, docs) {
      //console.log("response find : ", docs);
        res.json(docs)
    })
  }
})

router.post('/user', function(req, res) {
  //console.log(req.body);
  var newHash = hash.generate()
  var verif = new validEmail

  // var emailValid = validEmail(req.body.email)
  // TODO ; control email and password formats
  var emailValid = verif.control(req.body.email)

  if(!emailValid)
    res.send(401)

  console.log("emailValid : ", emailValid);
  var passValid = req.body.pwd

  var passEncrypt = bcrypt.hashSync(passValid)

  var data = {
      email : emailValid
    , pass: passEncrypt
    , hash : newHash
    , startDate : moment().format()
    , active : 'false'
    , level : '1'
  }

  console.log("data inserted : ", data, emailValid)

  var user = new User(data)

  user.save(function (err) {
    if (err)
      res.json({error : err})

      // create a new token for validate account
    var token = jwt.sign({
        expiresIn : "2d"
      , hash : newHash
      , email : emailValid
    }, "ilovecats")

    // TODO : Send token by email

    res.json({token : token})

  })

})

router.get('/user/validate', expressJwt({secret:"ilovecats"}), function(req, res) {

  if (!req.body.t || typeof req.body.t !== "string")
    res.send(401)

  var token = req.body.t



})


router.get('/user/:user_id', function(req, res) {
  res.json({action:" GET one user"})
})

router.delete('/user/:user_id', function(req, res) {
  res.json({action:"DELETE one user"})
})

router.put('/user/:user_id', function(req, res) {
  res.json({action:" PUT update for one user"})
})

// middleware for auth (passport)
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next()

  res.redirect('/') // if unauthenticated
}


module.exports = router
