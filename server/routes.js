"use strict"

var express = require('express')
var router = express.Router()

// middleware
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// API Routes
router.get('/user', function(req, res) {
  res.send('Users data')
})

router.get('/catalog', function(req, res) {
  res.send('catalog data')
})

// middleware for auth (passport)
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next()

  res.redirect('/') // if unauthenticated
}


module.exports = router
