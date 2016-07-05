"use strict"

module.exports = {
    controller : {
        'accountController' : require('./accountController')
      , 'editController' : require("./edit/editController")
      , 'emailEditController' : require("./edit/emailEditController")
      , 'emailEditValidController' : require("./edit/emailEditController")
    }
  , service : {
      'accountService': require('./accountService')
    , 'editService' : require("./edit/editService")
    , 'emailEditService' : require("./edit/emailEditService")
  }
}
