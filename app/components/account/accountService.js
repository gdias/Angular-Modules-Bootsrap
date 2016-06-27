"use strict"

module.exports.accountService = [
    "$http", "$q", "$cookies", "$location", "$rootScope"
    , function($http, $q, $cookies, $location, $rootScope){

      function logoutGenericMethod() {

        // remove cookies
        $cookies.remove("jwt-token")

        // remove local Storage
        localStorage.clear()


        $rootScope.auth = false

        // update header
        $rootScope.$emit('updateMenuEvent')

        // redirect en home
        $location.url('/')

      }


      return {
        logout : logoutGenericMethod
      }

    }]
