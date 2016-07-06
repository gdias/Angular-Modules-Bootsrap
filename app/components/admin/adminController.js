"use strict"

module.exports.adminController = [
  '$http', '$q', '$scope', '$rootScope', 'adminService'
, function($http, $q, $scope, $rootScope, adminService){

  $scope.msg = "ADMIN CONTROL"

  adminService.getAllUsers().then(ok, nok)

  function ok(d) {
    $scope.users = d
    console.log("adminService >>> ", d);
  }

  function nok(err){
    console.log(err);
  }
  //$scope.users =

  console.log("admin ctrl : ", $rootScope.admin);

}]


module.exports.adminUsersController = [
  '$http', '$q', '$scope', '$rootScope', '$routeParams', 'adminService'
, function($http, $q, $scope, $rootScope, $routeParams, adminService){
  $scope.user = {}

  //console.log(">>> >> edit : ",editDirective);
  console.log("$routeParams.id ::: ", $routeParams.id);

  $scope.msg = "ADMIN USER CONTROL"

  adminService.getUser($routeParams.id).then(ok, nok)

  function ok(d) {
    $scope.user = d

    console.log("adminUserService >>> ", d);
  }

  function nok(err){
    console.log(err);
  }
  //$scope.users =

  console.log("admin ctrl : ", $rootScope.admin);

}]
