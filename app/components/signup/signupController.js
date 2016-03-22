"use strict"

var jwt = require("jsonwebtoken")
//var signupService = require("./signupService").signupService

module.exports.signupController = ['$scope', '$http', 'signupService',
function signupController ($scope, $http, signupService){
  $scope.message = "Inscription"

  $scope.form = {}

  $scope.checkEmailExist = function(){

    //console.log("send this email : ", $scope.form.email);
    //  console.log("signupService : ",signupService);
    if (!!$scope.form.email)
      signupService.checkIfEmailExist($scope.form.email)
    //console.log("exist",exist);
    //console.log("email exist",exist);
  }


  $scope.signUpUser = function(){

    $http.post("/api/user", $scope.form).then(function(response, validateUrl){
      console.log("token ",response.data.token);

      if (!!response.data.token)
        validateUrl = [location.hostname, ":", location.port, "/#/validateAccount/", response.data.token].join("")

      console.log("use this url for validate your new account : ", validateUrl);
    }, function(err){
      console.log(err);
    })

  }

}]

module.exports.validateAccountController = ['$scope', '$http', '$routeParams', 'signupService',
  function validateAccountController ($scope, $http, $routeParams, signupService){

    if (!!$routeParams.token){
      var token = $routeParams.token
      $scope.form = {}
      $scope.form.show = false
      $scope.form.hide = true
      $scope.showPass = function() {

      }

      $scope.sendNewPass = function() {

      }

      if (token)
        $http({
            method: 'GET'
          , url: '/api/user/validate'
          , headers: {
            'Authorization': ['Bearer ',token].join("")
          }
        }).success(authOk).error(authNok)

        function authOk (data, status, headers, config){
          if (status === 200){
            console.log(data.msg)
          }
          $scope.result = data.msg
        }

        function authNok(err) {
          console.log("authNok");
          if (err) throw err
        }


    }
    // $http.post('/api/user/validate', {t : token}).then(function(rsp){
    //   console.log("get response server ; ", rsp);
    // })

  }
]
