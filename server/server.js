"use strict"

process.env.NODE_ENV = "development" // "production"

// ========== Require dependencies

var express         = require('express')
  , exphbs            = require('express-handlebars')
  , app          = express()
  , cookieParser = require('cookie-parser')
  , bodyParser   = require('body-parser')
  , morgan       = require("morgan")
  , i18n         = require('i18n')
  , configI18n   = require('./config/lang')
  , session      = require('express-session')
  , expressJWT   = require("express-jwt")
  , jwt          = require("jsonwebtoken")
  , devMode      = (app.get('env') === "development" ? true : false)


module.exports = function(path, port, welcome, db, parent, APIPathRoute) {

// ========== Configuration Server & connect to MongoDB
  welcome = ["The Express Server is started on ",port," port"].join("")
  parent = __dirname.substring(0, __dirname.lastIndexOf("/"))
  path = [parent, "/public"].join("")
  port = 8080

  // configure Express
  app.use(morgan('dev'))
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  //app.use(i18n.init)
  app.use(bodyParser.json())

  // statics file (SPA)
  app.use(express.static(path))

  // Auth routes api
  APIPathRoute = [
      /^\/api\/auth/
    , /^\/api\/user\/setadmin\/.*/
    , /^\/api\/user\/.*/
    , /^\/api\/users/
    , /^\/api\/verify\/email/
  ]

  if (devMode)
    APIPathRoute = [/^\/api/ , /^\/api\/.*/]

  // API secured
  app.use(expressJWT({secret:"ilovecats"}).unless({path:APIPathRoute}))
  app.use("/api", require('./routes'))

  // ========== Start Server
  app.listen(port)

  console.log(welcome)

}
