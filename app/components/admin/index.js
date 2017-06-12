"use strict"

module.exports = {
  controller : {
      'adminController' : require('./adminController')
    , 'adminUsersController' : require('./adminController').adminUsersController
  }
  , service : {
    'adminService' : require('./adminService')
  }
  , directive : {
    'editDirective' : require('../account/edit/editDirective')
  }
}
