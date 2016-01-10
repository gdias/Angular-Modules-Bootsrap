require('angular')


var app = angular.module('app', [])
var mainController = require("./controllers/controllers").mainController
var aboutController = require("./controllers/controllers").aboutController

app.controller('mainController', mainController)
app.controller('aboutController', aboutController)
