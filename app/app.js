require('angular')

var ngRoute = require('angular-route')
  , ngCookies = require('angular-cookies')
  , translate = require('angular-translate')
  , helpers = require('./routes/helpers')
  , routes = require("./routes/routes").config
  , app = angular.module('app', ['ngRoute', 'ngCookies'])

  app.config(routes)

  // menu
  helpers.addComponent(app, require("./shared/menu"))

  // public
  helpers.addComponent(app, require("./components/home"))
  helpers.addComponent(app, require("./components/about"))
  helpers.addComponent(app, require("./components/contact"))

  // auth
  helpers.addComponent(app, require("./components/signin"))
  helpers.addComponent(app, require("./components/signup"))

  //sandbox
  helpers.addComponent(app, require("./components/sandbox"))

  //account secure
  helpers.addComponent(app, require("./components/account"))

  // admin
  helpers.addComponent(app, require("./components/admin"))
