"use strict"

var moment = require("moment")

module.exports.editController = [
  '$http', '$q', 'editService', '$scope'
, function($http, $q, editService, $scope){




  editService.getInfoUser().then(availableData, errorHandler)

  function availableData(d) {
    if(!!d) {
      $scope.userID = d.data.id
      $scope.emailProfile = d.data.email
      $scope.startProfile = moment(d.data.startDate).fromNow()//.format("DD-MM-YYYY")
      $scope.levelProfile = d.data.level
      $scope.usernameProfile = (!!d.data.username ? d.data.username : "Undefined")
      $scope.activeProfile = d.data.active
    }

  }

  function errorHandler(err) {
    throw err
  }

}]
