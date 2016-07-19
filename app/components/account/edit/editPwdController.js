"use strict"

module.exports.editPwdController = [
    "$scope", "editService",
    function($scope, editService) {

        $scope.validOldPwd = false

    //    console.log('foo $scope.validOldPwd =>  ',$scope.validOldPwd)

        $scope.sendNewPass = function(e){
            e.preventDefault()

        //    console.log('foo send form')
        }

        $scope.blurControlOldPwd = function(e) {

            var valueInput = $scope.form.old

            if (!!valueInput && typeof valueInput == "string")
                editService.checkPwd(valueInput).then(validPwdOk, validPwdNok)

        }

        function validPwdOk(data) {
        //    console.log('foo Valid pwd')
            $scope.validOldPwd = true
        }

        function validPwdNok(err) {
            if (!!err)
                throw err

            if (err.status === 403) {
                // show error message
                $scope.error = "The entry password is not correct. Please, start this procedure typing your current password "
            }


            //console.log('foo ERROR ://: ',arguments)

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
