"use strict"

module.exports.accountController = ['$scope', '$http', '$rootScope', function signinController ($scope, $http, $rootScope){

  $scope.message = "Account"
  $rootScope.$emit('updateMenuEvent')
  
  //console.log("rscope : ", $rootScope);
  //$rootScope.menuAccount()

  //console.log("rootScope.auth : ", (!!$rootScope.auth ? "ok" : "nok"))

}]
