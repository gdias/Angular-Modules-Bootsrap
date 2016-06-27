"use strict"

module.exports.sandboxController = ['$scope', '$http', '$rootScope', '$cookies',
function($scope, $http, $rootScope, $cookies){

  $scope.num = 5

  var interval, sec
    sec = 5

    interval = setInterval(function(){
      $scope.$apply(function() {
        $scope.num = --sec
        console.log("$scope.sec :: ", $scope.num );
        if (sec == 0)
          clearInterval(interval)
      })
    }, 1000)


  //
  //
  // setTimeout(function(){
  //   console.log("clear");
  //   clearInterval(interval)
  // },4000)

}]
