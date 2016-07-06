'use strict'

module.exports.editDirective = ['$http', '$log', function($http, $log) {
  return {
    restrict: 'E'
    , transclude: true
    , template: '<span>{{text}}</span><input type="text" ng-model="text" />'
    , controller: function() {
      console.log("directive edit ok ! : ", arguments)
    }
    , link: function ($scope, $element, $attrs) {
      console.log("LINK ok ! : ", arguments)
    }
  }
}]
