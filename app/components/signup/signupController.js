"use strict"
var jwt = require("jsonwebtoken")

module.exports.signupController = ['$scope', '$http', function signupController ($scope, $http){
  $scope.message = "Inscription"

  $scope.form = {}

  //console.log("email : ",signUPform.email.value);

  // signUPform.email.blur = function() {
  //
  // }

  //console.log("email model : ", $scope.form.email);
  //var log = ($scope.form.email.indexOf("@") != -1 ? $scope.form.email.substr(0, $scope.form.email.indexOf("@")) : "")

  // $scope.form.log = log

  $scope.signUpUser = function(){
    //console.log(e)
    //e.preventDefault()

    console.log("form signUpUser",$scope.form);

    $http.post("/api/user", $scope.form).then(function(data){
      console.log("token ",data);

    }, function(err){
      console.log(err);
    })

  }

}]
