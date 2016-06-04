"use strict"

var routes = require("./base")


module.exports.accountRoutes = (function() {

  // Sign in
  routes.add("/account", {
      templateUrl: 'partials/secure/account.html'
    , controller: 'accountController'
    , resolve: {
        loggedin: checkLoggedin
      }
  })

  function checkLoggedin ($q, $timeout, $http, $location, $rootScope, $cookies, dfd, token) {

    dfd = $q.defer()
    token = $cookies.get("jwt-token") || window.localStorage.getItem('token')

    $http({
      method: 'GET'
      , url: '/api/auth'
      , headers: {
        'Authorization': ['Bearer ', token].join("")
      }
    }).success(function(user){
      if (user !== '0'){
        $rootScope.auth = true
        dfd.resolve()
      } else { // Not Authenticated
        $rootScope.auth = false
        $rootScope.message = 'You need to log in.'
        dfd.reject()
        $location.url('/signin')
      }
    }).error(function(err){
      $rootScope.auth = false
      $location.url('/signin')
    })

    return dfd.promise
  }

  return routes

})()
