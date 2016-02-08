"use strict";

var configDB = require('./config/database')
var mongoose = require('mongoose')

mongoose.connect(configDB.url)

module.exports.db = mongoose.connection
