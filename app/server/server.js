"use strict"

// ========== Require dependencies

var express  = require('express'),
      app  = express(),
      port = process.env.PORT || 9090,
      mongoose = require('mongoose'),
      passport = require('passport'),
      welcomeServer = ["The server is started on port ",port].join("")

var morgan = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      session  = require('express-session');

var configDB = require('../config/database');


// ========== Configuration Server & connect to MongoDB

// configure mongoose driver
mongoose.connect(configDB.url)

// configure passport
require("../config/passport")(passport)

// configure express
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser())

// configure passport
app.use(session({ secret: 'ihaveanheartasallpeoplearoundme' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// ========== Routes
require('./routes')(app, passport)

// ========== Start Server
app.listen(port)

console.log(welcomeServer)
