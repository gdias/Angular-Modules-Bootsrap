require('angular')

var ngRoute = require('angular-route')
    , ngCookies = require('angular-cookies')
    , helpers = require('./routes/helpers')
    , routes = require("./routes/routes").config
    , ngTranslate = require('angular-translate')
    , ngTranslateLocal = require("angular-dynamic-locale")
    , ngTranslateLocalStorage = require("angular-translate-storage-local")
    , ngTranslateCookie = require("angular-translate-storage-cookie")
    , ngTranslateStatic = require("angular-translate-loader-static-files")
    , ngTranslateHandlerLog = require("angular-translate-handler-log")
    , app = angular.module('app', ['ngRoute', 'ngCookies', 'pascalprecht.translate', 'tmh.dynamicLocale'])

  app.config(routes)
  app.constant('LOCALES', {
    'locales': {
          'fr_FR': 'Francais'
        , 'en_US': 'English'
    },
    'preferredLocale': 'en_US'
})

  // menu
  helpers.addComponent(app, require("./shared")) // locales
  helpers.addComponent(app, require("./shared/menu"))

  // public
  helpers.addComponent(app, require("./components/home"))
  helpers.addComponent(app, require("./components/about"))
  helpers.addComponent(app, require("./components/contact"))

  // auth
  helpers.addComponent(app, require("./components/signin"))
  helpers.addComponent(app, require("./components/signup"))

  //sandbox
  helpers.addComponent(app, require("./components/sandbox"))

  //account secure
  helpers.addComponent(app, require("./components/account"))

  // admin
  helpers.addComponent(app, require("./components/admin"))
