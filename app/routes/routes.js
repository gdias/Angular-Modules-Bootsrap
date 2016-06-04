"use strict"

var navRoutes = require('./nav.routes').navRoutes
var authRoutes = require('./auth.routes').authRoutes
var accountRoutes = require('./account.routes').accountRoutes

module.exports.config = [
    '$routeProvider', '$locationProvider'
  , function($routeProvider, $locationProvider, i, nav) {

    // Inject all Routes in route provider
    i = 0
    nav = navRoutes.routes

    while(nav[i]) {
      var currentRoute = nav[i]
      $routeProvider.when(currentRoute[0], currentRoute[1])
      ++i
    }

    $routeProvider.otherwise({
        redirectTo: '/'
    })

  }
]
