"use strict"


var sController = require('./signupController')
var sService = require('./signupService')

module.exports = {
    controller : {
        'signupController' : sController
      , 'validateAccountController' : sController.validateAccountController
    }
  , service : {'signupService': sService}
}
