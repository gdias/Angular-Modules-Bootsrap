"use strict"

var validEmail = require('../../../server/utils').validEmail
  , jwt = require("jsonwebtoken")


module.exports.renewControllerStart = ['$scope', '$http', '$window',
function renewControllerStart($scope, $http, $window){
    // next step handler
  $scope.nextStep = function(){

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


module.exports.renewValidController = ['$scope', '$http', '$routeParams',
  function renewValidController($scope, $http, $routeParams, token) {

    if (!!$routeParams.token){
      token = $routeParams.token
      console.log("token : ",token);
      $http({method: 'GET', url: '/api/authnewpass', headers: {
          'Authorization': ['Bearer ',token].join("")}
      }).then(authOk, authNok)

      function authOk() {
        // show form
        console.log("show the form");


      }

      function authNok() {
        console.error("Auth for change password has failed")
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
          $scope.error = response.data.error
      }
    })
  }


}]
