"use strict"

var navRoutes = require('./nav.routes').navRoutes
var authRoutes = require('./auth.routes').authRoutes
var accountRoutes = require('./account.routes').accountRoutes
var adminRoutes = require('./admin.routes').adminRoutes

module.exports.config = [
    '$routeProvider', '$locationProvider', '$translateProvider', 'tmhDynamicLocaleProvider'
  , function($routeProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider, i, nav) {

    // Inject all Routes in route provider
    i = 0
    nav = navRoutes.routes

    while(nav[i]) {
      var currentRoute = nav[i]
      $routeProvider.when(currentRoute[0], currentRoute[1])
      ++i
    }

    $routeProvider.otherwise({
        redirectTo: '/'
    })

    $locationProvider.html5Mode(true)

    $translateProvider.useMissingTranslationHandlerLog();

    $translateProvider.useStaticFilesLoader({
        prefix: 'resources/locale-',// path to translations files
        suffix: '.json'// suffix, currently- extension of the translations
    });

    $translateProvider.preferredLanguage('en-US')

    $translateProvider.useLocalStorage();

    tmhDynamicLocaleProvider.localeLocationPattern('node_modules/angular-i18n/angular-locale_{{locale}}.js')

  }


]
