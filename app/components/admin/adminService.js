"use strict"

module.exports.adminService = ["$http", "$q", "$cookies", "$location", "$rootScope"
    , function($http, $q, $cookies, $location, $rootScope){


        function getAllUsers(){

          var dfd = $q.defer()

          $http({
              method : "GET"
            , url : "/api/user/all"
            , headers : {
              'Authorization': ['Bearer ',$cookies.get("jwt-token")].join("")
            }

          }).success(function(data){
            dfd.resolve(data)
          }).error(function(err){
            dfd.reject(err)
          })

          return dfd.promise
        }

        function getUser(id) {

          var dfd = $q.defer()

          if (!!id)
            $http({
                method : "GET"
              , url : ["/api/user/full/",id].join("")
              , headers : {
                'Authorization': ['Bearer ',$cookies.get("jwt-token")].join("")
              }
            })
            .success(function(data){
              dfd.resolve(data)
            })
            .error(function(err){
              dfd.reject(err)
            })
          else
            dfd.reject()

          return dfd.promise
        }

        function updateDataUser(data) {

          // data represent a json object as follow : {'id':'_id', '_key':'_value'} + token

          var dfd = $q.defer()

          if (!!data && !!data.hasOwnProperty("id") && typeof data.id === "string"){

            var objData = {}

            for (var j in data)
              if (j != "id")
                objData[j] = data[j]

            $http({
                method : "PUT"
              , url : ["/api/user/",data.id].join("")
              , data : objData
              , headers : {
                'Authorization': ['Bearer ',$cookies.get("jwt-token")].join("")
              }
            })
            .success(function(data){
              dfd.resolve(data)
            })
            .error(function(err){
              dfd.reject(err)
            })

        } else
            dfd.reject()

        return dfd.promise
      }


      return {
          getAllUsers : getAllUsers
        , getUser : getUser
        , updateUser : updateDataUser
      }
}]
