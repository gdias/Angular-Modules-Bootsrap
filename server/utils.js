"use strict"

module.exports.hash = function(self){

  self.alpha = "abcdefghijklmnopqrstuvwxyz"
  self.numeric = "1234567890"
  self.uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  self.getFloor = function (array){
    return Math.floor(Math.random() * (!!array ? array.length : 10))
  }

  self.shuffle = function (array) {
    var counter = array.length
    while (counter > 0) {
        var index = Math.floor(Math.random() * counter)
        counter--

        var temp = array[counter]
        array[counter] = array[index]
        array[index] = temp
    }
    return array
}

  return {
      getAll : function(alphaArr, numArr, uppArr){
        alphaArr = self.alpha.split("")
        numArr = self.numeric.split("")
        uppArr = self.uppercase.split("")

        return [alphaArr, numArr, uppArr]
      }
    , generate : function() {
        var all = this.getAll()
        var arrFinal = []

        all.forEach(getType)

        function getType(type) {
          for(var k = 0; k < 10; ++k)
            arrFinal.push(type[self.getFloor(type)])
        }

        var hash = self.shuffle(arrFinal).join("")

        return hash
      }
  }
}(this)


module.exports.validEmail = function(email, self) {

  self = this
  self.sizeMax = 50

  self.testAt = function(email) {
    return (email.indexOf("@") > 0 ? true : false)
  }

  self.testPoint = function(str) {
    return (str.indexOf('.') > 0 ? true : false)
  }

  self.getDomain = function(email) {
    return email.substring(email.indexOf("@"), email.length)
  }

  self.checkSize = function(email) {
    return (email.length < self.sizeMax ? true : false)
  }

  self.error = function(msg) {
    console.error(msg)
    return false
  }

  self.control = function(email) {
    if (!email || email === "" || !self.checkSize(email))
      self.error("This input is not supported")

    if (self.testAt(email)) {
      var domain = self.getDomain(email)

      return (self.testPoint(domain) > 0 ? email : false)
    }
    else
      return false

  }

}
