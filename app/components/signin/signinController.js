"use strict"

//require('angular')

var validEmail = require('../../../server/utils').validEmail
  , jwt = require("jsonwebtoken")
  , Each = angular.forEach


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

    $scope.renew = function(helper, token, testEmail) {
      helper = new validEmail
      testEmail = helper.control($scope.form.mail)
      if (!!testEmail) {
        token = atob(JSON.parse(sessionStorage.getItem("renewVerif")))
        $http({
            method: 'POST'
            , url: '/api/user/renewpass'
            , data: {
                email : testEmail
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


module.exports.renewValidController = ['$scope', '$http', '$window', '$routeParams', '$document',
  function renewValidController($scope, $http, $window, $routeParams, $document, token, passwordsInput) {

    if (!!$routeParams.token){
      token = $routeParams.token

      $scope.form = {}
      $http({method: 'GET', url: '/api/user/authnewpass', headers: {
          'Authorization': ['Bearer ',token].join("")}
      }).then(authOk, authNok)

      function authOk(response) {
        $scope.form.show = true
        $scope.form.token = response.data.token
        console.log("show the form");
      }

      function authNok() {
        $scope.form.error = true
        console.error("Auth for change password has failed")
      }

      passwordsInput = $document.find("input")

      $scope.showPass = function(e) {
        e.preventDefault();

        (function switchType() {
          Each(passwordsInput, function(v, k, type){
            type = v.getAttribute("type")
            if (type === "password")
              v.setAttribute("type", "text")
              else if (type === "text")
                v.setAttribute("type", "password")
          })
        })()

      }

      $scope.sendFormNewPass = function(token) {

        if (!$scope.form.token)
          return false

        // TODO : call services for control data before send to server

        token = $scope.form.token

        $http({
            method: 'POST'
            , url: '/api/user/renewpasschange'
            , data: {
                pwd : $scope.form.pass
              , vpwd: $scope.form.passconfirm
              , step : 2
            }
            , headers: {
              'Authorization': ['Bearer ',token].join("")
            }
        }).then(
          function(response){
            // Redirect for display
            if (!response.data.error)
              $window.location.href = "/#/renewPassword/validChangeOk"
            else
              $scope.form.err.msg = response.data.error, $scope.error = true

          },
          function (err) {
            if (!!err)
              $scope.error = true
          }
        )

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

              // remove link
              e.srcElement.parentNode.removeChild(e.srcElement)

              // send request with token
              $http({method: 'POST', url: '/api/auth/rae', headers: {
                  'Authorization': ['Bearer ',t].join("")}
              }).then(arOK, arNOK)

              function arOK(){
                $scope.form.validresend = "The activation email was sent"
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
