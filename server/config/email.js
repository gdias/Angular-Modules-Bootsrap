"use strict"

var nodemailer        = require('nodemailer')
  , smtpTransport     = require('nodemailer-smtp-transport')
  , EMAILSERVER       = "localhost"


module.exports = {
    sender      : "ADMIN <admin@internet.com>"
  , server      : EMAILSERVER
  , transporter : function(config) {

      if (typeof config === "undefined")
        config = {
            host: EMAILSERVER //'smtp.gmail.com'
          , port: 25
        }

      return nodemailer.createTransport(smtpTransport(config))
  }
}
