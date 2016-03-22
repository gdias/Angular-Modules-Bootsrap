"use strict"

// ========== Require dependencies

var express      = require('express')
  , exphbs       = require('express-handlebars')
  , app          = express()
  , passport     = require('passport')
  , flash        = require('connect-flash')
  , morgan       = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser   = require('body-parser')
  , session      = require('express-session')
  , expressJWT   = require("express-jwt")
  , jwt          = require("jsonwebtoken")


module.exports = function(path, port, welcome, db, parent, APIpathRoute) {

// ========== Configuration Server & connect to MongoDB
  welcome = ["The Express Server is started on ",port," port"].join("")
  parent = __dirname.substring(0, __dirname.lastIndexOf("/"))
  path = [parent, "/public"].join("")
  port = 8080

  // configure Express
  app.use(morgan('dev'))
  app.use(cookieParser())
  app.use(bodyParser.json())

  // statics file (SPA)
  app.use(express.static(path))

  // Auth routes api
  APIpathRoute = [
      "/api/auth"
    , "/api/user/authnewpass"
    , "/api/user/renewpass"
    , "/api/verify/email"
    , "/api/user/validate"
    , "/api/user"
    , "/api/users"
  ]

  // API secured
  app.use(expressJWT({secret:"ilovecats"}).unless({path:APIpathRoute}))
  app.use('/api',require('./routes'))

  // required for passport
  // app.use(session({ secret: 'ihaveanheartasallpeoplearoundme' }))
  // app.use(passport.initialize())
  // app.use(passport.session())
  // app.use(flash())
  //
  // app.use(bodyParser.urlencoded({ extended: true }))


  // ========== Start Server
  app.listen(port)

  console.log(welcome)

}
