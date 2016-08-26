"use strict"

var lService = require("./LocaleService")
var lDirective = require("./LocaleDirective")

module.exports = {
  service : {
    'localeService' : lService
  }
  , directive : {
    'localeDirective' : lDirective
  }
}
