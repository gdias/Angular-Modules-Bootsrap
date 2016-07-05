"use strict"

module.exports = {
  controller : {
      'adminController' : require('./adminController')
    , 'adminUsersController' : require('./adminController').adminUsersController
  }
  , service : {
    'adminService' : require('./adminService')
  }
}
