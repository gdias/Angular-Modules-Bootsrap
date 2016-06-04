"use strict"

module.exports.homeController = ['$scope', '$http', '$locale', function homeController ($scope, $http, $locale){
  $scope.message = "Welcome here !"

  console.log($locale.id)
  console.log($locale.localeID)
}]
