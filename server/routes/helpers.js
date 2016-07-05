"use strict"

var   nodemailer        = require('nodemailer')
    , smtpTransport     = require('nodemailer-smtp-transport')
    , handlebars        = require('handlebars')
    , fs                = require('fs-promise')
    , extend            = require('extend')
    , Path              = require("path")
    , Q                 = require("q")
    , mailer            = require('../config/email')
    , validEmail        = require('../utils').validEmail
    , User              = require("../models/user")
    , loadtemplate


module.exports.controlAdmin = function (id) {
  var dfd = Q.defer()

  if(!!id && typeof id === "string") {
    User.find({"_id":id}, function(err, docs){
      var level = docs[0].level

      if(!!level)
        dfd.resolve(level === 666 ? true : false)
      else
        dfd.reject()

    })
  }
  return dfd.promise
}


module.exports.sendEmail = function(model, deferred) {

  deferred = Q.defer()

  if (model.hasOwnProperty("template"))
    module.exports.constructEmailTemplate(model.template).then(onsuccess, onerror)

  function onsuccess(template) {
    model.send["htmlEmail"] = template
    module.exports.sender(model.send)
    .then(function() {
        deferred.resolve(true)
      }, function(err) {
        deferred.reject("Err : ",err)
      }
    )
  }

  function onerror(err){
    console.log("err : ",err);
  }

  return deferred.promise
}

module.exports.sender = function(sendModel, deferred, sendData, transporter) {

    deferred = Q.defer()

    if (!sendModel.hasOwnProperty("from"))
        deferred.reject("no From")

    if (!sendModel.hasOwnProperty("to"))
        deferred.reject("no To")

    if (!sendModel.hasOwnProperty("htmlEmail"))
        deferred.reject("no content")

    sendData = {
      from: mailer.sender,
      to: sendModel.to,
      subject: sendModel.subject,
      html: sendModel.htmlEmail
    }

    transporter = mailer.transporter()

    transporter.sendMail(sendData, function(error, info){

      if(!!error)
        deferred.reject("Error : ",error)
      else
        deferred.resolve(info)

      console.log('Message sent: ' + info.response)
    })

    return deferred.promise
}

module.exports.constructEmailTemplate = function (dataEmail, bodyTemplate, deferred, hbsPath) {

  deferred = Q.defer()
  hbsPath = '/../hbs/'

  //console.log("Email model : ", dataEmail);

  if (!dataEmail)
    deferred.reject("no data")

  if (!dataEmail.hasOwnProperty("name"))
    deferred.reject("no template path")

  loadtemplate("footer", [hbsPath, 'commons/footer.hbs'].join(""))
  .then(loadtemplate("header", [hbsPath, 'commons/header.hbs'].join("")))
  .then(loadtemplate("body", [hbsPath, dataEmail.name, '.hbs'].join("")))
  .then(function(){

    fs.readFile(__dirname + hbsPath + 'index.hbs', 'utf8', function(err, data, model, tmpl, newModel){
      if (err)
        deferred.reject(err)

      if (!!data){
        model = {}

        // Control if minimal structure required of Model is available
        model["header_text"] = (!dataEmail.content.hasOwnProperty("header_text") ? " Email TEST #0 - Title" : dataEmail.content.header_text)
        model["footer_text"] = (!dataEmail.content.hasOwnProperty("footer_text") ? [" Copyright ", new Date().getFullYear()].join("") : dataEmail.content.footer_text)

        // extend jQ of dataEmail.content.body => model
        newModel = extend(true, model, dataEmail.content.body)

        // get global Template
        tmpl = handlebars.compile(data)

        // Resolve promise and return the result of compile template / data
        deferred.resolve(tmpl(newModel))
      }
      else
        deferred.reject("no data")

    })
  })

  return deferred.promise
}

module.exports.loadtemplate = loadtemplate = function (name, path, deferred) {
  deferred = Q.defer()

  if(!!path && !!name){
    var p = Path.normalize( __dirname + path)

    fs.readFile(p, 'utf8', function(err, data) {
      if (err)
      deferred.reject(err)

      handlebars.registerPartial(name, data)
      deferred.resolve(data)
    })

  }
  else
    console.error("HORROR")

  return deferred.promise
}
