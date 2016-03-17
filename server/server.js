"use strict"

// ========== Require dependencies

var express      = require('express')
  , exphbs       = require('express-handlebars')
  , app          = express()
  , passport     = require('passport')
  , flash        = require('connect-flash')

var morgan       = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser   = require('body-parser')
  , session      = require('express-session')

var expressJWT   = require("express-jwt")
  , jwt          = require("jsonwebtoken")


module.exports = function(path, port, welcome, db, parent) {

// ========== Configuration Server & connect to MongoDB
  welcome = ["The Express Server is started on ",port," port"].join("")
  //console.log([__dirname, "../public"].join(""));
  parent = __dirname.substring(0, __dirname.lastIndexOf("/"))
  path = [parent, "/public"].join("")
  //console.log("path : ",path);
  port = 8080

  // configure Mongoose driver (mongoDB)

  // configure Express
  app.use(morgan('dev'))
  app.use(cookieParser())
  app.use(bodyParser())

  // statics file (SPA)
  app.use(express.static(path))

  var arrayPaths = [
        "/api/auth"
      , "/api/verify/email"
      , "/api/user"
      , "/api/users"
    ]

  // API secured
//  app.use(expressJWT({secret:"ilovecats"}).unless({path:arrayPaths}))
  app.use('/api',require('./routes'))

  // required for passport
  // app.use(session({ secret: 'ihaveanheartasallpeoplearoundme' }))
  // app.use(passport.initialize())
  // app.use(passport.session())
  // app.use(flash())
  //
  // app.use(bodyParser.urlencoded({ extended: true }))
  // app.use(bodyParser.json())

  // ========== Start Server
  app.listen(port)

  console.log(welcome)

}
