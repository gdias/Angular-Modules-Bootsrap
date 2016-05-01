"use strict"

var jwt = require("jsonwebtoken")
//var i18n = require("i18n")

module.exports.signupController = ['$scope', '$http', 'signupService',
function signupController ($scope, $http, signupService){
  $scope.message = "Inscription"
  $scope.form = {}
  $scope.debug = true

  $scope.checkEmailFormat = function(){
      console.log($scope.form.email," - args",arguments, $scope.form.emailvalid)
  }

  $scope.checkPwdForce = function() {
    //console.log("controlPwdForce : ",controlPwdForce);
    $scope.form.validPwd = signupService.verifForcePwd($scope.form.pwd)
  }

  $scope.checkSame = function() {
    //console.log("isSAME ? ",$scope.form.pwd," <==<=>==> ",$scope.form.pwdconfirm, "--> ",($scope.form.pwd == $scope.form.pwdconfirm ? true : false));
    $scope.form.validPwdConfirm = ($scope.form.pwd == $scope.form.pwdconfirm ? true : false)
  }

  $scope.checkEmailExist = function(){
    //console.log("d : ",$scope.form.email)

    if (!!$scope.form.email)
      signupService.checkIfEmailExist($scope.form.email).then(function(data){
        console.log("data chce =  ",data);
        $scope.form.emailvalid = (!data ? true : false)
      })

  //  console.log("emailvalid : ", $scope.form.emailvalid);
  }


  $scope.signUpUser = function(){

    $http.post("/api/user", $scope.form).then(function(response, validateUrl){
      //console.log("token ",response.data.token);

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
        console.log("switch type of input text/password")
      }

      $scope.sendNewPass = function() {

      }

      if (!!token)
        $http({
            method: 'POST'
          , url: '/api/user/validate'
          , headers: {
            'Authorization': ['Bearer ',token].join("")
          }
        }).success(authOk).error(authNok)

        function authOk (data, status, headers, config){
          if (status === 200) {
            $scope.result = data.msg

            setTimeout(function(){
              location.href = "/"
            }, 4000)

          }
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
