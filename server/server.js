"use strict"

// ========== Require dependencies

var express  = require('express'),
      exphbs = require('express-handlebars'),
      app  = express(),
      port = process.env.PORT || 9090,
      mongoose = require('mongoose'),
      passport = require('passport'),
      flash = require('connect-flash'),
      welcomeServer = ["The Express Server is started on ",port," port"].join("")

var morgan = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      session  = require('express-session')

var configDB = require('./config/database')

// ========== Configuration Server & connect to MongoDB

// configure Mongoose driver (mongoDB)
mongoose.connect(configDB.url)

// configure Express
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser())

// configure template engine
var hbs = exphbs.create({
  layoutsDir : "./server/views",
  partialsDir : "./server/views/layouts",
  defaultLayout: 'template',
  extname: '.hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', './server/views')
// required for passport
app.use(session({ secret: 'ihaveanheartasallpeoplearoundme' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// ========== Routes
require('./routes')(app, passport)

// ========== Start Server
app.listen(port)
console.log(welcomeServer)
