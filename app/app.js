require('angular')
var ngRoute = require('angular-route')
var routes = require("./routes/routes.js").routes

var app = angular.module('app', ['ngRoute'])
app.config(routes)

var labelDirective = require("./directives/directives").labelDirective
var categoryService = require("./services/services").categoryService
var mainController = require("./controllers/controllers").mainController
var aboutController = require("./controllers/controllers").aboutController
var contactController = require("./controllers/controllers").contactController

app.controller('mainController', mainController)
app.controller('aboutController', aboutController)
app.controller('contactController', contactController)

app.directive('labelDirective', labelDirective)

app.service('categoryService', categoryService)
