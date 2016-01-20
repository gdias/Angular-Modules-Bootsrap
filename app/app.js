require('angular')
var ngRoute = require('angular-route')
var routes = require("./routes/routes").routes

var app = angular.module('app', ['ngRoute'])
    app.config(routes)

var homeController = require("./components/home/homeController").homeController
var aboutController = require("./components/about/aboutController").aboutController
var contactController = require("./components/contact/contactController").contactController

app.controller('homeController', homeController)
app.controller('aboutController', aboutController)
app.controller('contactController', contactController)
