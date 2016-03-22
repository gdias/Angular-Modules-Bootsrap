"use strict"

var express     = require('express')
  , router      = express.Router()



//  require('./api.auth')
  require('./api.user')

router.post('/auth', require('./api.auth').auth)

router.get('/user/authnewpass', expressJwt({secret:key}, require('./api.user').authnewpass)

router.post('/user', require('./api.user').user)
router.post('/user/renewpass', expressJwt({secret:key}), require('./api.user').renewpass)
router.post('/user/validate', expressJwt({secret:key}), require('./api.user').validate)

module.exports = router


  //app.use('/api/auth', )
  //app.use('/api/user', )
