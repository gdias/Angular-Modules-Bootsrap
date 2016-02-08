"use strict"

module.exports.menuController = ['$scope', '$http', '$rootScope', function menuController ($scope, $http, $rootScope){

  $scope.message = "Menu items"

  $rootScope.$on('updateMenuEvent', function (event, data) {
    if ($rootScope.auth)
      $scope.template = {name : "account", url:"'partials/commons/menuAccount.html'"}
  })

}]
