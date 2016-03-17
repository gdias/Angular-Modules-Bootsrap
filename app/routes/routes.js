"use strict"

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope, $cookies){

  var deferred = $q.defer()
  var token = $cookies.get("jwt-token") || window.localStorage.getItem('token')

  $http({
    method: 'GET'
    , url: '/api/auth'
    , headers: {
      'Authorization': ['Bearer ', token].join("")
    }
  }).success(function(user){
    if (user !== '0'){
      $rootScope.auth = true
      deferred.resolve()
    } else { // Not Authenticated
      $rootScope.auth = false
      $rootScope.message = 'You need to log in.'
      deferred.reject()
      $location.url('/signin')
    }
  }).error(function(err){
    $rootScope.auth = false
    $location.url('/signin')
  })

  return deferred.promise
}


module.exports.routes = [
    '$routeProvider'
  , function($routeProvider) {
    // Router
    $routeProvider
    .when('/home', {
          templateUrl: 'partials/home.html'
        , controller: 'homeController'
    })
    .when('/about', {
          templateUrl: 'partials/about.html'
        , controller: 'aboutController'
    })
    .when('/contact', {
          templateUrl: 'partials/contact.html'
        , controller: 'contactController'
    })
    .when('/signin', {
          templateUrl: 'partials/signin.html'
        , controller: 'signinController'
    })
    .when('/signup', {
          templateUrl: 'partials/signup.html'
        , controller: 'signupController'
    })
    .when('/account', {
          templateUrl: 'partials/secure/account.html'
        , controller: 'accountController'
        , resolve: {
            loggedin: checkLoggedin
          }
    })
    .otherwise({
        redirectTo: '/home'
    })
  }
]
