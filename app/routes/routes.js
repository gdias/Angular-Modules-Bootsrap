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


module.exports.config = [
    '$routeProvider', '$locationProvider'
  , function($routeProvider, $locationProvider) {

    // Router
    $routeProvider
    .when('/', {
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
    .when('/signup/valid', {
          templateUrl: 'partials/auth/signup_valid.html'
    })
    .when('/validateAccount/:token', {
          templateUrl: 'partials/auth/validateAccount.html'
    })
    .when('/renewPassword/start', {
          templateUrl: 'partials/auth/renew_start.html'
        , controller : 'renewControllerStart'
    })
    .when('/renewPassword/form', {
          templateUrl: 'partials/auth/renew_form.html'
        , controller: 'renewController'
    })
    .when('/renewPassword/validForm', {
        templateUrl : 'partials/auth/renew_validForm.html'
    })
    .when('/renewPassword/validNotActive', {
        templateUrl : 'partials/auth/renew_validNotActive.html'
    })
    .when('/renewPassword/valid/:token', {
          templateUrl: 'partials/auth/renew_valid.html'
        , controller: 'renewValidController'
    })
    .when('/renewPassword/validChangeOk', {
        templateUrl : 'partials/auth/renew_validOk.html'
    })
    .when('/account', {
          templateUrl: 'partials/secure/account.html'
        , controller: 'accountController'
        , resolve: {
            loggedin: checkLoggedin
          }
    })
    .otherwise({
        redirectTo: '/'
    })

    // Remove Hash on routes
    $locationProvider.html5Mode({
        enabed : true
      , requireBase: false
    })


  }
]
