"use strict"

var express = require('express')
  , router  = express.Router()
  , key = require("../config/auth").key
  , expressJwt = require("express-jwt")

router.use("/auth", require('./api.auth'))
router.use("/user", require('./api.user'))
router.use("/verify", require('./api.verify'))
router.use("/users", require('./api.users'))

// Base of API
router.get("/", function(req, res) {
    console.log('Welcome on this API. Only some routes are not secured like this.')
    res.sendStatus(200)
})


module.exports = router
