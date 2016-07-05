"use strict"


var sbController = require('./sandboxController')
var sbService = require('./sandboxService')

module.exports = {
    controller : {'sandboxController' : sbController}
  , service : {'sandboxService': sbService}
}
