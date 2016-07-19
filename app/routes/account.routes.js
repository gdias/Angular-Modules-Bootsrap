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

  // Home edit (personnal informations)
  routes.add("/account/edit", {
      templateUrl: 'partials/secure/edit.html'
    , controller: 'editController'
    , resolve: {
        loggedin : checkAuth
    }
  })

  // Email edit
  routes.add("/account/edit/email", {
      templateUrl: 'partials/secure/edit.email.html'
    , controller: 'editEmailController'
    , resolve: {
        loggedin : checkAuth
    }
  })

  // Email valid email edit view
  routes.add("/account/edit/email/valid", {
      templateUrl: 'partials/secure/edit.email.html'
    , controller: 'editEmailController'
    , resolve: {
        loggedin : checkAuth
    }
  })

  // Email valid edit (email link)
  routes.add("/account/edit/email/valid/:token", {
      templateUrl: 'partials/secure/edit.email.valid.html'
    , controller: 'emailEditValidController'
    , resolve: {
        loggedin : checkAuth
    }
  })

  // Password edit
  routes.add("/account/edit/password", {
    templateUrl: 'partials/secure/edit.password.html'
    , controller: 'editPwdController'
    , resolve: {
      loggedin : checkAuth
    }
  })

  // Password edit valid
  routes.add("/account/edit/password/:token", {
    templateUrl: 'partials/secure/edit.password.html'
    , controller: 'editPwdControllerValid'
    , resolve: {
      loggedin : checkAuth
    }
  })

  // Delete account
  routes.add("/account/delete", {
    templateUrl: 'partials/secure/delete.account.html'
    , controller: 'deleteController'
    , resolve: {
      loggedin : checkAuth
    }
  })

  return routes

})()
