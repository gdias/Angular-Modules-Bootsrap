"use strict";

var gulp = require('gulp')
  , connect = require('gulp-connect')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')
  , sass = require('gulp-sass')
  , uglify = require('gulp-uglify')
  , minify = require('gulp-minify-css')
  , rename = require('gulp-rename')
  , notify = require("gulp-notify")
  , plumber = require("gulp-plumber")
  , express = require('express')
  , nodemon = require('gulp-nodemon')
  , angularProtractor = require('gulp-angular-protractor')
  , lr
  , EXPRESS_ROOT = [__dirname, "/public"].join("")
  , EXPRESS_PORT = 8080
  , LIVERELOAD_PORT = 35729

// Error handler
var reportError = function (error) {
    notify({
        title: ['Gulp Task Error : ', error.plugin, " | Error ", error].join(""),
        message: error.message
    }).write(error.message)

    this.emit('end')
}

// API REST

var startLivereload = function() {
  lr = require('tiny-lr')()
  lr.listen(LIVERELOAD_PORT)
}

var notifyLivereload = function(event, fileName) {
    fileName = require('path').relative(EXPRESS_ROOT, event.path)

    lr.changed({
      body: {
        files: [fileName]
      }
    })

}

gulp.task('protractor', function(callback) {
    gulp.src(['./app/tests/*.js'])
        .pipe(angularProtractor({
            'configFile': './config/protractor.conf.js',
            'debug': false,
            'autoStartStopServer': true
        }))
        .on('error', function(e) {
            console.log("E : ",e);
        })
        .on('end', callback);
});

gulp.task('connect', function() {
  require("./server/server")(EXPRESS_ROOT, EXPRESS_PORT)
  startLivereload()
});


gulp.task('start', function() {
  nodemon({
    script: 'server/server.js'
  , watch : "server/**/*"
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
  require("./server/server")(EXPRESS_ROOT, EXPRESS_PORT)
  startLivereload()
});

gulp.task('sass', function(){
  return gulp.src('./app/sass/styles.scss')
    .pipe(plumber({
        errorHandler: reportError
    }))
    .pipe(sass())
    .on('error', reportError)
    .pipe(gulp.dest('./public/css'))
})

gulp.task('browserify', function() {
  return browserify('./app/app.js')
    .bundle()
    .on('error', reportError)
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public/js/'))
})

gulp.task('compress', function(){
  gulp.src('./public/js/main.js')
    .pipe(uglify())
    .on('error', reportError)
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest('./public/js/'))

  gulp.src('./public/css/styles.css')
    .pipe(minify())
    .on('error', reportError)
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest('./public/css/'))
})

gulp.task('watch', function () {
  gulp.watch(['./app/**/*.js'], ['browserify'])
  gulp.watch(['./app/**/*.scss'], ['sass'])
  gulp.watch(['./server/server.js', './public/**/*.html', './public/js/main.js', './public/css/styles.css'], notifyLivereload)
})

gulp.task('watchTests', function () {
  gulp.watch(['./app/**/*.js'], ['browserify'])
  //gulp.watch(['./server/server.js', './public/**/*.html', './public/js/main.js', './public/css/styles.css'], notifyLivereload)
})

gulp.task('default', ['start', 'watch', 'browserify', 'sass']);
gulp.task('test', ['browserify', 'watchTests', 'protractor'])
gulp.task('prod', ['browserify', 'sass', 'compress'])
