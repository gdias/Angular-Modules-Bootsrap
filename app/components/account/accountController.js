"use strict"

module.exports.accountController = [
  '$scope', '$http', '$rootScope', '$cookies',
  function signinController ($scope, $http, $rootScope, $cookies){

  $scope.message = "Account"
  $rootScope.$emit('updateMenuEvent')

}]

module.exports.deleteController = [
  '$scope', '$http', '$rootScope', '$cookies',
  function signinController ($scope, $http, $rootScope, $cookies){

  $scope.message = "Delete account"
  $rootScope.$emit('updateMenuEvent')


}]
