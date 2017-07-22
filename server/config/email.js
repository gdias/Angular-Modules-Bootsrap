"use strict"

var nodemailer = require('nodemailer')
  , EMAILSERVER = "localhost"

module.exports = {
    sender : "ADMIN <admin@internet.com>"
  , server : EMAILSERVER
  , transporter : function(config, resp) {

      if (typeof config === "undefined")
        config = {
            host: EMAILSERVER //'smtp.gmail.com'
          , port: 25
        }

      try {
        resp = nodemailer.createTransport(config)
      } catch (e) {
        throw e
        console.error("ERROR : ",e)
      } finally {
        return resp
      }
  }

}
