"use strict"

module.exports.menuController = [
  '$scope', '$http', '$rootScope', 'accountService', '$translate'
, function menuController ($scope, $http, $rootScope, accountService, $translate){

  $scope.message = "Menu items"
  $scope.tpl = {}
  $scope.tpl.contentUrl = 'partials/commons/menu.html'

  $scope.logout = function(e) {
    e.preventDefault()
    accountService.logout()
  }

  $scope.changeLang = function(lang) {
      console.log('foo ',lang)
      $translate.use(lang)
  }

  $rootScope.$on('updateMenuEvent', function (event, data) {

    if (!!$rootScope.auth)
      $scope.tpl.contentUrl = 'partials/commons/menuAccount.html'
    else
      $scope.tpl.contentUrl = 'partials/commons/menu.html'

  })

}]
