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
          templateUrl: 'partials/auth/signin.html'
        , controller: 'signinController'
    })
    .when('/signup', {
          templateUrl: 'partials/auth/signup.html'
        , controller: 'signupController'
    })
    .when('/validateAccount/:token', {
          templateUrl: 'partials/auth/validateAccount.html'
        //, controller: 'validateAccountController'
    })
    .when('/renewPassword/start', {
          templateUrl: 'partials/auth/renew_start.html'
    })
    .when('/renewPassword/form', {
          templateUrl: 'partials/auth/renew_form.html'
        , controller: 'renewController'
    })
    .when('/renewPassword/valid/:token', {
          templateUrl: 'partials/auth/renew_valid.html'
        , controller: 'renewValidController'
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
