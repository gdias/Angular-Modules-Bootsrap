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

    $http.post("/api/user", $scope.form).then(function(response){
      console.log("token ",response.data.token);

    }, function(err){
      console.log(err);
    })

  }

}]
