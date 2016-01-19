"use strict"


module.exports.mainController = ['$scope', '$http', function mainController ($scope, $http){
  $scope.message = "Home content"
}]

module.exports.aboutController = ['$scope', '$http', function aboutController ($scope, $http){
  $scope.message = "About content";
}]

module.exports.contactController = ['$scope', '$http', function contactController ($scope, $http){
  $scope.message = "Contact content";
}]
