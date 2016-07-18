"use strict"

module.exports = {
    controller : {
        'accountController': require('./accountController')
      , 'editController': require("./edit/editController")
      , 'editEmailController': require("./edit/editEmailController")
      , 'emailEditValidController': require("./edit/editEmailController")
    }
  , service : {
      'accountService': require('./accountService')
    , 'editService': require("./edit/editService")
    , 'editEmailService': require("./edit/editEmailService")
  }
  // , directive : {
  //   'edit': require('./edit/editDirective')
  // }
}
