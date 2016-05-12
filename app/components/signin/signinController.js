"use strict"

//require('angular')

var validEmail = require('../../../server/utils').validEmail
  , jwt = require("jsonwebtoken")
  , $ = angular.element


module.exports.renewControllerStart = ['$scope', '$http', '$window',
function renewControllerStart($scope, $http, $window){
    // next step handler
  $scope.nextStep = function(e){

    e.preventDefault()

    // generate an new token by server for show form for renew password
    $http({
        method : 'GET'
      , url:"/api/user/renewpassstart"
    }).then(function(response) {

      // set the token in sessionStorage encoded in base64
      if (!response.data.token){
        console.error("Une erreur est survenue. Veuillez contacter le webmaster")
        return false
      }

      var t = response.data.token

      sessionStorage.setItem("renewVerif", JSON.stringify(btoa(t)))
      $window.location.href = "/#/renewPassword/form"

      // location
    }, function(err){
      if (!!err.data)
        console.error(err.data)
      else
        console.log(err)
    })

  }
}]


module.exports.renewController = ['$scope', '$http', '$window', '$cookies', '$location', '$rootScope',
  function renewController ($scope, $http, $window, $cookies, $location, $rootScope){

    $scope.form = {}

    if (sessionStorage.getItem("renewVerif") == null)
      $window.location.href = "/"

    $scope.renew = function(testEmail, token) {
      testEmail = new validEmail

      if (!!testEmail.control($scope.form.mail)) {
        token = atob(JSON.parse(sessionStorage.getItem("renewVerif")))
        $http({
            method: 'POST'
            , url: '/api/user/renewpass'
            , data: {
                email : $scope.form.mail
              , step : 1
            }
            , headers: {
              'Authorization': ['Bearer ',token].join("")
            }
        }).then(
          function(response){

            // Redirect for display
            $window.location.href = (!response.data.error
              ? "/#/renewPassword/validForm"
              : "/#/renewPassword/validNotActive")

          }, function(err){
            console.error(err)
          }
        )


      }

      //console.log("to send this adress", $scope.form.mail)
    }

  }
]


module.exports.renewValidController = ['$scope', '$http', '$routeParams', '$document',
  function renewValidController($scope, $http, $routeParams, $document, token, passwordsInput) {

    if (!!$routeParams.token){
      token = $routeParams.token
      $scope.form = {}
      $http({method: 'GET', url: '/api/user/authnewpass', headers: {
          'Authorization': ['Bearer ',token].join("")}
      }).then(authOk, authNok)

      function authOk(response) {
        $scope.form.show = true
        $scope.form.token = response
        console.log("show the form");
      }

      function authNok() {
        $scope.form.error = true
        console.error("Auth for change password has failed")
      }

      passwordsInput = $document.find("input[type=password]")

      $scope.showPass = function(e) {
        e.preventDefault();

        (function switchType() {
          console.log("passwordsInput :: ", passwordsInput);
          passwordsInput.each(function(){
            console.log(arguments)

          })
        })()

      }

      $scope.sendFormNewPass = function() {

        if (!$scope.form.token)
          return false

        var token = $scope.form.token


        $http({
            method: 'POST'
            , url: '/api/user/renewpass'
            , data: {
                email : $scope.form.mail
              , step : 1
            }
            , headers: {
              'Authorization': ['Bearer ',token].join("")
            }
        })

      }

      //var testDecode = jwt.verify(token)
      //console.log("tokenize :: ",testDecode);

    //   location.hash.split(",")
    }

  }
]


module.exports.signinController = ['$scope', '$http', '$window', '$cookies', '$location', '$rootScope',
function signinController ($scope, $http, $window, $cookies, $location, $rootScope){

  $scope.message = "Authentication"
  $scope.form = {}
  $scope.form.persist = true
  $scope.activationMailStatus = false
  function authOk(){
    // get a localStorage with token
    $rootScope.auth = true

    if (!!$scope.form.persist)
      $cookies.put("jwt-token", window.localStorage.getItem('token')) // save token

    // redirection vers une page securisée
    $location.url('/account')
  }

  function authNok() {
    console.log("auth NOK")
  }

  $scope.auth = function(){

    $http.post("/api/auth", $scope.form).then(function(response){

      if (!response.data.error){
        window.localStorage.setItem("token", response.data)

        $http({method: 'GET', url: '/api/auth', headers: {
            'Authorization': ['Bearer ',response.data].join("")}
        }).then(authOk, authNok)

      } else {
          if (response.data.type === 2) {

            var t = response.data.token

            $scope.activationMailStatus = true

            $scope.resendActivateEmail = function(e) {
              e.preventDefault()
              // send request with token
              //console.log("token : ",t);

              $http({method: 'POST', url: '/api/auth/rae', headers: {
                  'Authorization': ['Bearer ',t].join("")}
              }).then(arOK, arNOK)

              function arOK(){
                console.log("Resend RAE OK");
              }

              function arNOK(){
                console.error("Resend NOK");
              }

            }

            $scope.activateLinkText = "Resend Activation Email"
          }
          $scope.error = response.data.error
      }
    })
  }



}]
