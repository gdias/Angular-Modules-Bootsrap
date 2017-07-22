"use strict"

module.exports.checkAuth = ["$q", "$timeout", "$http", "$location", "$rootScope", "$cookies",
function ($q, $timeout, $http, $location, $rootScope, $cookies, dfd, token) {

//  console.log("checkAuth");

  dfd = $q.defer()
  token = $cookies.get("jwt-token") || window.localStorage.getItem('token')

  if (!token)
    dfd.reject()

  if (!$cookies.get("jwt-token") && !!token)
    $cookies.put("jwt-token", token)

  $http({
    method: 'GET'
    , url: '/api/auth'
    , headers: {
      'Authorization': ['Bearer ', token].join("")
    }
  }).then(function success(response, data) {
    if (response !== '0' && response.status === 200) {
      $rootScope.auth = true
      data = response.data.user
      $rootScope.admin = data.isAdmin
      $rootScope.email = data.email
      dfd.resolve()
    } else { // Not Authenticated
      $rootScope.auth = false
      $rootScope.message = 'You need to log in.'
      dfd.reject()
      $location.url('/signin')
    }

  }, function error(err) {
    $rootScope.auth = false
    dfd.reject()
    $location.url('/signin')
  })

  return dfd.promise
}]


module.exports.checkAuthAdmin = ["$q", "$timeout", "$http", "$location", "$rootScope", "$cookies",
function ($q, $timeout, $http, $location, $rootScope, $cookies, dfd, token) {

//  console.log("checkAuth");

  dfd = $q.defer()
  token = $cookies.get("jwt-token") || window.localStorage.getItem('token')

  if (!token)
    dfd.reject()

  if (!$cookies.get("jwt-token") && !!token)
    $cookies.put("jwt-token", token)

      $http({
          method : "GET"
        , url : "/api/auth/admin"
        , headers: {
          'Authorization': ['Bearer ', token].join("")
        }
      }).then(function success(isAdmin){

        if (!isAdmin)
          $location.url('/account'),
          $rootScope.admin = false

        $rootScope.admin = true
        dfd.resolve()

      }, function error(err){
        $rootScope.admin = false
        dfd.reject()
        $location.url('/account')
      })


  return dfd.promise
}]

// This module allow the load of Controllers, Services and Directives
module.exports.addComponent = function (app, component) {

  if (!component.hasOwnProperty("service")
   && !component.hasOwnProperty("controller")
   && !component.hasOwnProperty("directive")){
    throw "Bad arguments"
    return
  }

    for(var v in component)
      load(v, app, component[v])


    function load(type, app, content, foo, v, i) {

      if (!!type && !!app && !!content) {
        for (foo in content) {
          i = content[foo]
          for(v in i)
            app[type](v, i[v])
        }
      }
      else
        throw "Error : Bad arguments"

    }
}
