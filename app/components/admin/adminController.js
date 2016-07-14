"use strict"

module.exports.adminController = [
  '$http', '$q', '$scope', '$rootScope', 'adminService'
, function($http, $q, $scope, $rootScope, adminService){

  $scope.msg = "ADMIN CONTROL"

  adminService.getAllUsers().then(ok, nok)

  function ok(d) {
    $scope.users = d
  }

  function nok(err){
    console.log(err);
  }

}]


module.exports.adminUsersController = [
  '$http', '$q', '$scope', '$rootScope', '$routeParams', 'adminService'
, function($http, $q, $scope, $rootScope, $routeParams, adminService){
  $scope.user = {}

  $scope.msg = "ADMIN USER CONTROL"

  adminService.getUser($routeParams.id).then(ok, nok)


  function ok(d) {
    $scope.user = d[0]
  }

  function nok(err){
    console.log(err);
  }

}]
