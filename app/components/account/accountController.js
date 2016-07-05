"use strict"

module.exports.accountController = [
  '$scope', '$http', '$rootScope', '$cookies',
  function signinController ($scope, $http, $rootScope, $cookies){

  $scope.message = "Account"
  $rootScope.$emit('updateMenuEvent')

  

  //console.log("rscope : ", $rootScope);
  //$rootScope.menuAccount()

  //  console.log("rootScope.auth : ", $rootScope.auth )

}]
