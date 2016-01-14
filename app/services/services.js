"use strict";

module.exports.categoryService = ['$http', function($http) {

       this.getAllCategory = function(){
           return $http.get('/api/category').then(handleSuccess, handleError);
       }

       this.getOneCat = function(id, p) {
          p = ['/api/category/',id].join("")
          return $http.get(p).then(handleSuccess, handleError);
       }

       function handleSuccess(r) {
         return r.data;
       }

       function handleError(r) {
         console.log("ERROR : "+r.data);
       }

}]
