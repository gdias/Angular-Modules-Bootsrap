"use strict"

module.exports.accountController = [
  '$scope', '$http', '$rootScope', '$cookies',
  function accountController ($scope, $http, $rootScope, $cookies){

    $scope.message = "Account"
    $rootScope.$emit('updateMenuEvent')

  }
]

module.exports.deleteController = [
  '$scope', '$http', '$rootScope', '$cookies',
  function deleteController ($scope, $http, $rootScope, $cookies){

    $scope.message = "Delete account"
    $rootScope.$emit('updateMenuEvent')

    $scope.deleteAccount = function(e) {
      e.preventDefault()
      // TODO : send email for delete your account
    }

  }
]
