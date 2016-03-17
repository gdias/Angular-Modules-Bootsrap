require('angular')
var ngRoute = require('angular-route')
var ngCookies = require('angular-cookies')
var routes = require("./routes/routes").routes

var app = angular.module('app', ['ngRoute', 'ngCookies'])
    app.config(routes)

var homeController = require("./components/home/homeController").homeController
  , aboutController = require("./components/about/aboutController").aboutController
  , contactController = require("./components/contact/contactController").contactController
  , signinController = require("./components/signin/signinController").signinController
  , signupController = require("./components/signup/signupController").signupController
  , accountController = require("./components/account/accountController").accountController
  , menuController = require("./shared/menu/menuController").menuController
  , signupService = require("./components/signup/signupService").signupService


app.controller('homeController', homeController)
app.controller('menuController', menuController)
app.controller('aboutController', aboutController)
app.controller('contactController', contactController)

app.controller('signinController', signinController)
app.controller('signupController', signupController)

app.controller('accountController', accountController)

app.service('signupService', signupService)
