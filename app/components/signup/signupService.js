"use strict"

module.exports.signupService = ["$http", "$q",
    function($http, $q){

    function emailExist (email) {
      var deferred = $q.defer()

      $http.post('/api/verify/email', {"email" : email})
      .then(handleSuccess, handleError)

      function handleSuccess (response, data) {
        // console.log(response.data);
        data = (!!response && !!response.data ? response.data : false)

        console.log("handleSuccess (checkIfEmailExist) : ", data)
        deferred.resolve(data)
      }

      function handleError (err) {
        console.error("Error : ",err)
        deferred.reject(err)
      }

      return deferred.promise
    }



    function verifForce (pwd, sizeMin, find) {
      if (!!pwd || typeof pwd !== "undefined"){
      // 1. check size
      // 2. check number
      sizeMin = 6

        if ( pwd.length >= sizeMin ) {
          find = pwd.match(/\d+/g)
          if(find != null)
              return true
            else
              return false
        } else
          return false
      } else
        return false
    }

    return {
        checkIfEmailExist : emailExist
      , verifForcePwd : verifForce
    }

  }
]
