"use strict"

module.exports.menuController = [ 
  '$scope', '$http', '$rootScope', 'accountService'
, function menuController ($scope, $http, $rootScope, accountService){

  $scope.message = "Menu items"
  $scope.tpl = {}
  $scope.tpl.contentUrl = 'partials/commons/menu.html'

  $scope.logout = function(e) {
    e.preventDefault()
    accountService.logout()
  }

  $rootScope.$on('updateMenuEvent', function (event, data) {

    if (!!$rootScope.auth)
      $scope.tpl.contentUrl = 'partials/commons/menuAccount.html'
    else
      $scope.tpl.contentUrl = 'partials/commons/menu.html'

  })

}]
