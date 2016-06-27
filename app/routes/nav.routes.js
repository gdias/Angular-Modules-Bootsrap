"use strict"

var routes = require("./base")


module.exports.navRoutes = (function() {

  routes.add("/", {
        templateUrl: 'partials/home.html'
      , controller: 'homeController'
  })

  routes.add("/about", {
        templateUrl: 'partials/about.html'
      , controller: 'aboutController'
  })

  routes.add("/contact", {
        templateUrl: 'partials/contact.html'
      , controller: 'contactController'
  })

  routes.add("/sandbox", {
        templateUrl : "partials/sandbox.html"
      , controller : "sandboxController"
  })

  return routes
})()
