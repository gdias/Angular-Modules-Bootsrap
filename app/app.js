require('angular')


var app = angular.module('app', [])
var mainController = require("./controllers/controllers").mainController
var aboutController = require("./controllers/controllers").aboutController

var labelDirective = require("./directives/directives").labelDirective

var categoryService = require("./services/services").categoryService

app.controller('mainController', mainController)
app.controller('aboutController', aboutController)

app.directive('labelDirective', labelDirective)

app.service('categoryService', categoryService)
