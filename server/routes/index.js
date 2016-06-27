"use strict"

var express = require('express')
  , router  = express.Router()

router.use("/auth", require('./api.auth'))
router.use("/user", require('./api.user'))
router.use("/verify", require('./api.verify'))
router.use("/account", require('./api.account'))
router.use("/users", require('./api.users'))

// Base of API
router.get("/", function(req, res) {
    console.log('Welcome on this API. Only some routes are not secured like this.')
    res.sendStatus(200)
})


module.exports = router
