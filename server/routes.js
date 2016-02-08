"use strict"

var express = require('express')
var router = express.Router()
var jwt = require("jsonwebtoken")
var expressJwt = require("express-jwt")

var db = require("./database").db
var User = require("./models/user")


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

  var em = req.body.email
  var pw = req.body.pwd

  // check email
  User.find({email:em}, function (err, docs) {

      if(!!docs.length){
        if(docs[0].pass === pw){
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
})

router.post('/user', function(req, res) {
  console.log(req.body);
  var data = {
    email : req.body.email,
    pass: req.body.pwd
  }

  console.log("data inserted : ", data)



  var user = new User(data)

  user.save(function (err) {
    if (err)
      res.json({error : err})
  })

  res.sendStatus(200);
//  res.json({action : 'POST : add user data'})

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
