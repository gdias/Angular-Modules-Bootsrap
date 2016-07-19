"use strict"

module.exports = {
    controller : {
        'accountController': require('./accountController')
      , 'editController': require("./edit/editController")
      , 'editEmailController': require("./edit/editEmailController")
      , 'emailEditValidController': require("./edit/editEmailController")
      , 'editPwdController': require("./edit/editPwdController")
      , 'editPwdControllerValid' : require("./edit/editPwdController").editPwdControllerValid
      , 'deleteController': require('./accountController').deleteController
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
