"use strict";


module.exports.routes = [
  '$routeProvider',
  function($routeProvider) {
    // Router
    $routeProvider
    .when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'homeController'
    })
    .when('/about', {
        templateUrl: 'partials/about.html',
        controller: 'aboutController'
    })
    .when('/contact', {
        templateUrl: 'partials/contact.html',
        controller: 'contactController'
    })
    .otherwise({
        redirectTo: '/home'
    });
  }
]
