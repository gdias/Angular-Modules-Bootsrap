"use strict"

var helpers      = require("../routes/helpers")
  , configEmail  = require("../config/email")
  , ROOTCLIENT   = require("../config/main").urlRootClient // Url Client Root
  , Q            = require("q")

module.exports.sendEmailChangeEmail = function(to, token, emailModel, emailTo){

  var deferred = Q.defer()

  if (typeof to !== "string") deferred.reject("Bad arguments")
  else emailTo = to

  emailModel = {
    template : {
        name : "email_default"
      , content : {
          header_text : "You have make an demand for change your email attached on your account"
        , body : {
            title : "Change your email contact"
          , text : "Just click on this link for continue the procedure, and change your email contact. If your are not at origin of this demand, please don't click and contact us. "
          , button : {
              link : [ROOTCLIENT, "account/edit/email/valid/",token].join("")
            , text : "Update your email"
          }
        }
      }
    }
    , send : {
        from: configEmail.sender
      , to: emailTo
      , subject: '[IMPORTANT] - You want to change your email ?'
    }
  }

  return helpers.sendEmail(emailModel)
}
