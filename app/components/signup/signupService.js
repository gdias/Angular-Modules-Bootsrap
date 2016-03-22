"use strict"

// TODO : Method for control if email exist

module.exports.signupService = ["$http", "$q",
    function($http, $q){
        //var apiurl = "//localhost:8181"
        this.checkIfEmailExist = function(email) {
            return $http.post('/api/verify/email', {"email" : email}).then(handleSuccess, handleError)
        }

        function handleSuccess(response){
          var data = response.data

          console.log("handleSuccess : ", data)
          //console.log("complete response : ", response.data)
          // angular.forEach(data, function (key, values) {
          //
          // })
          return data
        }
        function handleError(resp){

            console.log("Error : ",resp);
        }

    }
]
