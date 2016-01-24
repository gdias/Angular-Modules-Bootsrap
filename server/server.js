"use strict"

// ========== Require dependencies

var express  = require('express'),
      exphbs = require('express-handlebars'),
      app  = express(),
      mongoose = require('mongoose'),
      passport = require('passport'),
      flash = require('connect-flash')

var morgan = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      session  = require('express-session')

var configDB = require('./config/database')

module.exports = function(path, port, welcome) {

// ========== Configuration Server & connect to MongoDB
  welcome = ["The Express Server is started on ",port," port"].join("")

  // configure Mongoose driver (mongoDB)
  mongoose.connect(configDB.url)

  // configure Express
  app.use(morgan('dev'))
  app.use(cookieParser())
  app.use(bodyParser())

  // statics file (SPA)
  app.use(express.static(path))

  // ========== API Routes
  app.use('/api',require('./routes'))

  // required for passport
  app.use(session({ secret: 'ihaveanheartasallpeoplearoundme' }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())

  // ========== Start Server
  app.listen(port)

  console.log(welcome)

}
