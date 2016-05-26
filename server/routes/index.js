"use strict"

var express     = require('express')
  , router      = express.Router()
  , key         = require("../config/auth").key
  , expressJwt  = require("express-jwt")


router.post('/auth', require('./api.auth').auth)
router.get('/auth', expressJwt({secret:key}), require('./api.auth').authValid)
router.post('/auth/rae', expressJwt({secret:key}), require('./api.auth').resendActivateEmail)

router.get('/user/setadmin/:id', require('./api.user').setAdmin)

router.get('/users', require('./api.user').allusers) //TODO : securise it

//console.log(require('./api.user').setAdmin);
router.post('/user', require('./api.user').user)

router.get('/user/authnewpass', expressJwt({secret:key}), require('./api.user').authnewpass)

router.get('/user/renewpassstart', require('./api.user').renewpassstart)

router.post('/user/renewpass', expressJwt({secret:key}), require('./api.user').renewpass)
router.post('/user/renewpasschange', expressJwt({secret:key}), require('./api.user').renewpasschange)
router.post('/user/validate', expressJwt({secret:key}), require('./api.user').validate)

//router.get('/user/:user_id', require('./api.user').getuser)
router.post('/verify/email', require('./api.user').verifyEmail)

//
// , function(req, res){
//   console.log(">> body : ",req.body)
//   res.json(200, {"body request : " : req.body})
// })

module.exports = router
