'use strict'

module.exports.editDirective = ['$http', '$log', function($http, $log) {
  return {
    restrict: 'E'
    , transclude: true
    , template: '<span>{{type}} : </span>\
                 <span ng-hide="editMode">{{text}}</span>\
                 <input type="text" ng-model="text" ng-show="editMode" ng-blur="hide($event)"/>\
                 <a href="#" ng-click="editActive($event)">edit</a>'
    , controller: function($scope, adminService) {

      $scope.editMode = false

      var keyUp = null

      $scope.editActive = function(e) {
        e.preventDefault()

        $scope.editMode = true
        var input = e.srcElement.previousElementSibling

        if (!!input)
          setTimeout(function(){
            input.focus()
          }, 50)

          keyUp = function (event){
            if (event.key === "Enter")
              input.blur()
          }

          document.addEventListener('keyup', keyUp, false);
      }

      $scope.hide = function(e, target, type, value, id, datajson) {

        document.removeEventListener('keyup', keyUp)

        $scope.editMode = false

        type = $scope.type
        value = $scope.text
        id = $scope.id

        if (!type || !value || !id)
          return

        datajson = {'id' : id} //, type:value}
        datajson[type] = value

        adminService.updateUser(datajson).then(function(response){
          console.log("update success ! ", response);
        }, function(err) {
          console.log("update NOK ! ",err);
        })
      }

    }
    , link: function ($scope, $element, $attrs) {
      if (!!$attrs.value)
        $scope.text = $attrs.value,
        $scope.type = $attrs.type,
        $scope.id = $attrs.id
      else
        $scope.text = ""
    }
  }
}]
