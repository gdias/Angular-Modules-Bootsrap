"use strict"

module.exports.signinController = ['$scope', '$http', '$window', '$cookies', '$location', '$rootScope',
function signinController ($scope, $http, $window, $cookies, $location, $rootScope){

  $scope.message = "Identification"
  $scope.form = {}
  $scope.form.persist = true

  function authOk(){
    // get a localStorage with token

    $rootScope.auth = true

    if (!!$scope.form.persist)
      $cookies.put("jwt-token",window.localStorage.getItem('token')) // save token

    // redirection vers une page securisée
    $location.url('/account')
  }

  function authNok() {
    console.log("auth NOK")
  }

  $scope.auth = function(){

    $http.post("/api/auth", $scope.form).then(function(response){

      if (!response.data.error){
        window.localStorage.setItem("token", response.data)

        $http({method: 'GET', url: '/api/auth', headers: {
            'Authorization': ['Bearer ',response.data].join("")}
        }).then(authOk, authNok)


      } else {
          console.log("Error ",response.data.error)
      }
    })
  }


}]
