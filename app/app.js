require('angular')

var ngRoute = require('angular-route')
  , ngCookies = require('angular-cookies')
  , translate = require('angular-translate')
  , routes = require("./routes/routes").config
  , app = angular.module('app', ['ngRoute', 'ngCookies'])

var SiController = require("./components/signin/signinController")
  , SuController = require("./components/signup/signupController")

var homeController = require("./components/home/homeController").homeController
  , aboutController = require("./components/about/aboutController").aboutController
  , contactController = require("./components/contact/contactController").contactController
  , signinController = SiController.signinController
  , signupController = SuController.signupController
  , validateAccountController = SuController.validateAccountController
  , accountController = require("./components/account/accountController").accountController
  , menuController = require("./shared/menu/menuController").menuController
  , renewController = SiController.renewController
  , renewControllerStart = SiController.renewControllerStart
  , renewValidController = SiController.renewValidController
  , signupService = require("./components/signup/signupService").signupService
  , emailEditController = require("./components/account/edit/emailEditController").emailEditController
  , emailEditValidController = require("./components/account/edit/emailEditController").emailEditValidController
  , emailEditService = require("./components/account/edit/emailEditService").emailEditService
  , accountService = require("./components/account/accountService").accountService

  , editController = require("./components/account/edit/editController").editController
  , editService = require("./components/account/edit/editService").editService

  , sandboxController = require("./components/sandbox/sandboxController").sandboxController

app.config(routes)

app.controller('homeController', homeController)
app.controller('menuController', menuController)
app.controller('aboutController', aboutController)
app.controller('contactController', contactController)

app.controller('signinController', signinController)
app.controller('signupController', signupController)
app.controller('validateAccountController', validateAccountController)
app.controller('renewController', renewController)
app.controller('renewControllerStart', renewControllerStart)
app.controller('renewValidController', renewValidController)

app.controller('accountController', accountController)
app.controller('emailEditController', emailEditController)
app.controller('emailEditValidController', emailEditValidController)

app.controller('editController', editController)

app.controller('sandboxController', sandboxController)

app.service('signupService', signupService)
app.service('emailEditService', emailEditService)
app.service('accountService', accountService)
app.service('editService', editService)
