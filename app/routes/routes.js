"use strict"

var navRoutes = require('./nav.routes').navRoutes
var authRoutes = require('./auth.routes').authRoutes
var accountRoutes = require('./account.routes').accountRoutes
var adminRoutes = require('./admin.routes').adminRoutes


module.exports.config = [
    '$routeProvider', '$locationProvider', '$translateProvider'
  , function($routeProvider, $locationProvider, $translateProvider, i, nav) {

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

    $locationProvider.html5Mode(true)

    //$translateProvider.preferredLanguage('en-US')

    //translates multi lang
    $translateProvider.translations('en', require("../../lang/en"))
    $translateProvider.translations('fr', require("../../lang/fr"))
  }


]
