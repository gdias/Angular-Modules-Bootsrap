"use strict"

var routes = require("./base")
var checkAuth = require("./helpers").checkAuth

module.exports.accountRoutes = (function() {

  // Account
  routes.add("/account", {
      templateUrl: 'partials/secure/account.html'
    , controller: 'accountController'
    , resolve: {
        loggedin : checkAuth
    }
  })

  // Home account edit
  routes.add("/account/edit", {
      templateUrl: 'partials/secure/edit.html'
    , resolve: {
        loggedin : checkAuth
    }
  })

  // Email edit
  routes.add("/account/edit/email", {
      templateUrl: 'partials/secure/edit.email.html'
    , controller: 'emailEditController'
    , resolve: {
        loggedin : checkAuth
    }
  })

  return routes

})()
