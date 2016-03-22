"use strict"

var validEmail = require('../../../server/utils').validEmail
  , jwt = require("jsonwebtoken")


module.exports.renewController = ['$scope', '$http', '$window', '$cookies', '$location', '$rootScope',
  function renewController ($scope, $http, $window, $cookies, $location, $rootScope){

    $scope.form = {}

    $scope.renew = function(testEmail) {
      testEmail = new validEmail

      if (!!testEmail.control($scope.form.mail)) {
        console.log("post email : ", $scope.form.mail);
        $http.post(
          "/api/user/renewPassword"
          , {
              email : $scope.form.mail
            , step : 1
          }
        ).then(function(response){
          console.log(response);
          if (!response.data.error){
            console.log();
          }
        })

        // TODO : return token by mail, with email in parameter

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
