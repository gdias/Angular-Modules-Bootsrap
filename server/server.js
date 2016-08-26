"use strict"

process.env.NODE_ENV = "development" // "production"

// ========== Require dependencies

var express      = require('express')
  , https        = require("https")
  , fs           = require("fs")
  , exphbs       = require('express-handlebars')
  , app          = express()
  , Static       = express()
  , cookieParser = require('cookie-parser')
  , bodyParser   = require('body-parser')
  , morgan       = require("morgan")
  , i18n         = require('i18n')
  , configI18n   = require('./config/lang')
  , session      = require('express-session')
  , expressJWT   = require("express-jwt")
  , jwt          = require("jsonwebtoken")
  , path         = require('path')
  , devMode      = (app.get('env') === "development" ? true : false)
  , KEY          = require("./config/auth").key


module.exports = function(rootpath, appPath, port, api_port, secure_port, secure_api_port, welcome, db, parent, APIPathRoute) {

// ========== Configuration Server & connect to MongoDB
  rootpath = path.resolve("./public")
  appPath = path.resolve("./app")
  //nModulesPath = path.resolve("./nodes_modules")

  secure_port = 4443

  welcome = ["The APP is hosted on : ",secure_port," port"].join("")

  // configure Express
  app.use(morgan('dev'))
  app.use(cookieParser())

  // app.use(bodyParser())
  i18n.configure(configI18n)

  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  //app.use(i18n.init)
  app.use(bodyParser.json())

  // statics file (SPA)
  app.use(express.static(rootpath))

  // Auth routes api
  APIPathRoute = [
      /^\/api\/user/
    , /^\/api\/auth/
    , /^\/api\/user\/setadmin\/.*/
    , /^\/api\/verify\/email/
    , /^\/api\/verify\/email\/different/
    , /^\/api\/users/              // TODO : temporary
  ]

  // if (devMode)
  //   APIPathRoute = [/^\/api/ , /^\/api\/.*/, /^\/api\/.*\/.*/]
// .unless({path:APIPathRoute})
  // API secured
  //app.all("/api", expressJWT({secret:"ilovecats"}).unless({path:APIPathRoute}))
  app.use("/api", expressJWT({secret:KEY}).unless({path:APIPathRoute}), require('./routes'))

  app.get("/resources/*", function(req, res){
    var p = [appPath, "/", req.url].join("")
    res.sendFile(p)
  })

  app.get("/node_modules/*", function(req, res){
    var p = [path.resolve("./"), req.url].join("")
    res.sendFile(p)
  })

  app.get('*', function (req, res) {
    var p = [rootpath, '/' ,'index.html'].join("")
    res.sendFile(p)
  })

  // ========== Create & Start Https Server
  https.createServer({
    key: fs.readFileSync(path.resolve('./config/key.pem')),
    cert: fs.readFileSync(path.resolve('./config/cert.pem'))
  }, app).listen(secure_port)

  console.log(welcome)


}
