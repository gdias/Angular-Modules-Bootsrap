"use strict"

module.exports.menuController = ['$scope', '$http', '$rootScope', function menuController ($scope, $http, $rootScope){

  console.log("menuController - ", $scope);

  $scope.message = "Menu items"
  $scope.tpl = {}
  $scope.tpl.contentUrl = 'partials/commons/menu.html'

  $rootScope.$on('updateMenuEvent', function (event, data) {

    if (!!$rootScope.auth)
      $scope.tpl.contentUrl = 'partials/commons/menuAccount.html'

  })

}]
