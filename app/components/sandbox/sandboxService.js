"use strict"

module.exports.sandboxService = [
          "$http", "$location", "$q",
  function($http, $location, $q) {

    var data = {}

    var getData = function(name) {
       // implementation details go here
    }

    var setData = function(name, value) {
       // implementation details go here
    }

    var ready = function(nextPromises) {
        // implementation details go here
    }

    var service = {
        getData: getData,
        setData: setData,
        ready: ready
    };

    return service
  }
]
