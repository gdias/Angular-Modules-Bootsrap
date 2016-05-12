"use strict"

var helpers      = require("../routes/helpers")
  , configEmail  = require("../config/email")
  , ROOTCLIENT   = require("../config/main").urlRootClient // Url Client Root
  , Q            = require("q")


module.exports.sendAccountActivationEmail = function (to, token, a, emailModel, emailTo) {

  var deferred = Q.defer()

  if (typeof to !== "string" || typeof token !== "string") deferred.reject("Bad arguments")
  else emailTo = to

  emailModel = {
    template : {
        name : "email_activate"
      , content : {
          header_text : "Welcome !"
      //, footer_text : "Custom Footer"
        , body : {
            title : "You must active your account for continue !"
          , text : "For activate your account, you must just click on the next button."
          , button : {
              link : [ROOTCLIENT, "validateAccount/" ,token].join("")
            , text : "Activer votre compte"
          }
        }
      }
    }
    , send : {
        from: configEmail.sender
      , to: emailTo
      , subject: '[WELCOME] - Activate your registration and continue on our website.'
    }
  }

  return helpers.sendEmail(emailModel)

};


module.exports.sendRenewPasswordAccess = function (to, token, a, emailModel, emailTo) {

  var deferred = Q.defer()

  if (typeof to !== "string" || typeof token !== "string") deferred.reject("Bad arguments")
  else emailTo = to

  emailModel = {
    template : {
        name : "email_renew_1"
      , content : {
          header_text : "You wish to change your password ?"
      //, footer_text : "Custom Footer"
        , body : {
            title : "For change your password, follow the guide ! "
          , text : "The first step consist to click on the link at bottom of this email. <br/>\
                    If you've not do this request, please ignore this email and contact us."
          , button : {
              link : [ROOTCLIENT, "renewPassword/valid/" ,token].join("")
            , text : "Change your password"
          }
        }
      }
    }
    , send : {
        from: configEmail.sender
      , to: emailTo
      , subject: '[IMPORTANT] - You requested to change your password'
    }
  }

  return helpers.sendEmail(emailModel)

};
