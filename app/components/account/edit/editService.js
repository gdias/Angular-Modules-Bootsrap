"use strict"

var jwt = require("jsonwebtoken")
  
module.exports.editService = ["$http", "$q", "$cookies",
    function($http, $q, $cookies){

      function getInfoUser(_id) {

        return (!!_id && typeof _id === "string"
                  ? $http({
                      method:'GET'
                    , url :'/api/user'
                    , headers : {
                      'Authorization': ['Bearer ',$cookies.get("jwt-token")].join("")
                    }
                  })
                  : false)

      }

      function getInfoThisUser() {
        var token = $cookies.get("jwt-token")
        var t = jwt.decode(token)

        // get id :
        return getInfoUser(t.id)
      }


      return {
          getInfoUserById : getInfoUser
        , getInfoUser : getInfoThisUser
      }

    }
]
