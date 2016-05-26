"use strict"

var helpers      = require("../routes/helpers")
  , configEmail  = require("../config/email")
  , ROOTCLIENT   = require("../config/main").urlRootClient // Url Client Root
  , Q            = require("q")



module.exports.sendValidRenewPassword = function(to, emailModel, emailTo) {

    var deferred = Q.defer()

    if (typeof to !== "string") deferred.reject("Bad arguments")
    else emailTo = to

    emailModel = {
      template : {
          name : "email_default"
        , content : {
            header_text : "Your password has been changed !"
          , body : {
              title : "You have a new password"
            , text : "Now, you can to navigate on our wonderful website with your beautiful new password."
            , button : {
                link : [ROOTCLIENT, "signin"].join("")
              , text : "Sign in"
            }
          }
        }
      }
      , send : {
          from: configEmail.sender
        , to: emailTo
        , subject: '[IMPORTANT] - Your password has been changed'
      }
    }

    return helpers.sendEmail(emailModel)

}

module.exports.sendAccountActivationEmail = function (to, token, emailModel, emailTo) {

  var deferred = Q.defer()

  if (typeof to !== "string" || typeof token !== "string") deferred.reject("Bad arguments")
  else emailTo = to

  emailModel = {
    template : {
        name : "email_default"
      , content : {
          header_text : "Welcome ! "
      //, footer_text : "Custom Footer"
        , body : {
            title : "You must active your account to continue !"
          , text : "To activate your account, you must click on the next button."
          , button : {
              link : [ROOTCLIENT, "validateAccount/" ,token].join("")
            , text : "Activate your account"
          }
        }
      }
    }
    , send : {
        from: configEmail.sender
      , to: emailTo
      , subject: '[REGISTRATION] - Activate your registration and continue on our website.'
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
        name : "email_default"
      , content : {
          header_text : "You wish to change your password ?"
        , body : {
            title : "To change your password, follow the procedure !"
          , text : "Please click on the link at the bottom of this email to reset your password. <br/>\
                    If you didn't initiate this request, please ignore this email or contact us."
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
