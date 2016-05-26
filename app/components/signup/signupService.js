"use strict"

module.exports.signupService = ["$http", "$q",
    function($http, $q){

    function emailExist (email) {
      var deferred = $q.defer()

      $http.post('/api/verify/email', {"email" : email})
      .then(handleSuccess, handleError)

      function handleSuccess (response, data) {
        data = (!!response && !!response.data ? response.data : false)

        deferred.resolve(data)
      }

      function handleError (err) {
        console.error("Error : ",err)
        deferred.reject(err)
      }

      return deferred.promise
    }

    function checkPwdSize(pwd, min, max) {
      min = 6
      max = 50
      return !!pwd ? pwd.length > min  && pwd.length < max ? true : false : false
    }

    function checkPwdNum(pwd) {
      return !!pwd && !!pwd.match(/\d+/g) ? true : false
    }

    function emailFormat(email, self) {
      self = this
      // TODO
      // 1. has @
      // 2. has domain
      // 3. has ext

      if (!!email) {

        self.hasAt = (function(){return self.at !== -1 ? true : false})()
        self.hasPointExt = (function(){return self.point !== -1 ? true : false})()
        self.limitSize = (function(){return emaiL < 100 ? true : false})()

        self.mail = email
        self.at = email.indexOf("@")
        self.point = email.lastIndexOf(".")
        self.emaiL = self.email.length
        self.fullDomain = email.substring(self.at, self.emaiL)
        self.ext = email.substring(self.point, self.emaiL)
        self.extSize = (self.ext.length > 6 ? false : true)

        // control htmlchars

        if (self.emaiL > 4)
          if(!self.hasAt) // Control has @
            self.errorHandler(0)
          else if(!self.hasPointExt) // Control has . after @
            self.errorHandler(1)
          else if(!self.limitSize) // Control if size of email is under 100
            self.errorHandler(2)
          else if(!self.extSize) // Control size of extension
            self.errorHandler(3)

        //self.greatEmailFormat()

        self.errorHandler = function(err, errMsg) {
          errMsg = null
          if(!!err)
            switch (err) {
              case 0 :
                console.error('This email has no @ !')
                break;
              case 1 :
                console.error('This email has no extention !')
                break;
              case 2 :
                console.error('This email is too long !')
                break;
              case 3 :
                console.error('The extention of this email has bad format !')
                break;
            }
          else
            return null

          console.error(err)
        }

      }

    }

    return {
    checkIfEmailExist : emailExist//
      , checkPwdSize : checkPwdSize
      , checkPwdNum : checkPwdNum
      , checkEmailFormat : emailFormat
    }

  }
]
