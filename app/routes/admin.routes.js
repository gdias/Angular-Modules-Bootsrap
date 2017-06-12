"use strict"

var routes = require("./base")
var checkAuthAdmin = require('./helpers').checkAuthAdmin

module.exports.adminRoutes = (function() {

  // Sign in
  routes.add("/admin", {
      templateUrl: 'partials/secure/admin/dashboard.html'
    , controller: 'adminController'
    , resolve: {
        loggedin : checkAuthAdmin
    }
  })

  routes.add("/admin/user/:id", {
    templateUrl: 'partials/secure/admin/users/details.html'
    , controller: 'adminUsersController'
    , resolve: {
      loggedin : checkAuthAdmin
    }
  })




})()
