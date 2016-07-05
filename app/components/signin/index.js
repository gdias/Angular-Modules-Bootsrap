"use strict"

var sController = require("./signinController")

module.exports = {
  controller : {
      'signinController' : sController
    , 'renewController'  : sController.renewController
    , 'renewControllerStart'  : sController.renewControllerStart
    , 'renewValidController'  : sController.renewValidController
  }
}
