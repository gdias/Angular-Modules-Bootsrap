"use strict"

var express     = require('express')
  , router      = express.Router()
  , key         = require("../config/auth").key
  , expressJwt  = require("express-jwt")


router.post('/auth', require('./api.auth').auth)
router.get('/auth', expressJwt({secret:key}), require('./api.auth').authValid)

router.get('/user/setadmin/:id', require('./api.user').setAdmin)

router.get('/users', require('./api.user').allusers) //TODO : securise it
router.post('/user', require('./api.user').user)

//console.log(require('./api.user').setAdmin);

router.get('/user/authnewpass', expressJwt({secret:key}), require('./api.user').authnewpass)
router.post('/user/renewpass', expressJwt({secret:key}), require('./api.user').renewpass)
router.post('/user/validate', expressJwt({secret:key}), require('./api.user').validate)

//router.get('/user/:user_id', require('./api.user').getuser)
router.post('/verify/email', require('./api.user').verifyEmail)




module.exports = router
