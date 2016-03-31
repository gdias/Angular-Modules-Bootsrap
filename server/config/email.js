"use strict"

var nodemailer  = require('nodemailer')

module.exports = {
    sender      : "ADMIN <admin@internet.com>"
  , server      : "localhost"
  , transporter : function() {
    var smtpConfig = {
        host: 'localhost' //'smtp.gmail.com'
      , port: 25
    }
    return nodemailer.createTransport(smtpConfig)
  }
}
