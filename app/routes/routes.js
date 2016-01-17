"use strict";


module.exports.routes = [
  '$routeProvider',
  function($routeProvider) {

        // Système de routage
        $routeProvider
        .when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'mainController'
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
