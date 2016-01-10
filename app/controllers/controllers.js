"use strict"


module.exports.mainController = ['$scope', '$http', function mainController ($scope, $http){
  $scope.message = "Angular loaded !";
}]

module.exports.aboutController = ['$scope', '$http', function aboutController ($scope, $http){
  $scope.message = "About content";
}]
