"use strict"

module.exports.editPwdController = [
    "$scope", "$location", "$cookies", "editService",
    function($scope, $location, $cookies, editService) {

        $scope.validOldPwd = false

    //    console.log('foo $scope.validOldPwd =>  ',$scope.validOldPwd)

        $scope.sendNewPass = function(e){
            e.preventDefault()

            var token = $cookies.get("jwt-token")
            var currentPwd = $scope.form.old
            var newPwd = $scope.form.new
            var newPwdConfirm = $scope.form.new2

            debugger


            if (!token)
              $location.redirect("/")

            if (currentPwd !== newPwd)
              $http({
                  method:"POST"
                , url : "/api/edit/pwd"
                , data: {
                    currentpwd : currentPwd
                  , newpwd : newPwd
                  , newpwdconfirm : newPwdConfirm
                }
                , headers: {
                  'Authorization': ['Bearer ',token].join("")
                }
              }).then(successHandler, errorHandler)

        }

        $scope.blurControlOldPwd = function(e) {

          if (!!$scope.form){

            var valueInput = $scope.form.old

            if (!!valueInput && typeof valueInput == "string")
                editService.checkPwd(valueInput).then(validPwdOk, validPwdNok)
          }
        }

        function validPwdOk(data) {

            $scope.validOldPwd = true

        }

        function validPwdNok(err) {

            if (err.status === 403) {
                // show error message
                $scope.showError = true
                $scope.error = "The entry password is not correct. Please, start this procedure typing your current password "

                //throw err

            }

            return false
        }

    }
]


module.exports.editPwdControllerValid = [
    "$scope",
     function($scope) {
         console.log('foo edit password')
    }
]
