"use strict"

var validEmail = require('../../../../server/utils').validEmail

module.exports.editEmailController = ['$scope', '$http', '$rootScope', '$cookies', "editEmailService", "signupService"
, function signinController ($scope, $http, $rootScope, $cookies, editEmailService, signupService){

  //console.log(editEmailService);
  $scope.sendButtonShow = true
  $scope.validShow = false
  $scope.errMsg = ""
  $scope.errShow = false

  $scope.sendNewEmail = function() {

    // get token valided on cookies
    var token = $cookies.get("jwt-token")

    //get new email
    var newEmail = $scope.newemail

    // send httpRequest
    if (!!token && !!newEmail) {
      var valid = new validEmail

      //control email
      var emailControlled = valid.control(newEmail)

      // control email if already exist
      signupService.checkIfEmailExist(emailControlled).then(function(alreadyExist){

          if (!alreadyExist) { // if not exist

            if(!!$scope.errShow) $scope.errShow = false // set Error show at false for hide it

          //  editEmailService.differentOld(emailControlled).then(successDiffHandler, errorHandler)
            $http({
                  method: "POST"
                , url: "/api/account/edit/email"
                , data: { email : emailControlled }
                , headers: {
                  'Authorization': ['Bearer ',token].join("")
                }
            }).then(successHandler, errorHandler)


          } else {

            var err = "This email already exist, you didn't choose this email as new email contact"

            $scope.errShow = true
            $scope.errMsg = err

            throw err
          }
      }, function(err){
        if (err)
          throw err
      })
    }



    function successHandler() {
      $scope.sendButtonShow = false
      $scope.validShow = true
    }

    function errorHandler(err) {
      $scope.errShow = true
      $scope.validShow = false

      throw(err)
      console.error("ERROR : ",err)
    }

  }

}]

module.exports.emailEditValidController = ['$scope', '$http', '$rootScope', '$routeParams', 'accountService'
, function signinController ($scope, $http, $rootScope, $routeParams, accountService){

  var token = $routeParams.token

  $scope.valid = false
  $scope.error = false

  if (!!token)
    $http({
        method: 'GET'
      , url: '/api/account/edit/email/valid'
      , headers: {
        'Authorization': ['Bearer ',token].join("")
      }
    }).then(success, fail)

  function success() {
    $scope.valid = true

    $scope.num = 5

    var interval, sec
      sec = 5

      interval = setInterval(function(){
        $scope.$apply(function() {
          $scope.num = --sec
          if (sec === 0)
            clearInterval(interval),
            accountService.logout()
        })
      }, 1000)

  }

  function fail(err){
    $scope.error = true
    console.error("ERROR : ",err)
  }


}]
