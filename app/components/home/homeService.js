"use strict"

module.exports.homeService = [
  '$http',
  function($http) {

    this.getAllArticle = function(){
       return $http.get('/api/article').then(handleSuccess, handleError)
    }

    this.getOneArticle = function(id, p) {
      p = ['/api/article/',id].join("")
      return $http.get(p).then(handleSuccess, handleError)
    }

    function handleSuccess(r) {
     return r.data
    }

    function handleError(r) {
     console.log("ERROR : "+r.data)
    }

  }
]
