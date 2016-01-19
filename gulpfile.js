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

// Error handler
var reportError = function (error) {
    notify({
        title: ['Gulp Task Error : ', error.plugin].join(""),
        message: error.message
    }).write(error.message)

    this.emit('end')
}

gulp.task('connect', function() {
  connect.server({
      root: 'public'
    , livereload: true
    , port : "8080"
  });
});

gulp.task('sass', function(){
  return gulp.src('./app/sass/styles.scss')
    .pipe(plumber({
        errorHandler: reportError
    }))
    .pipe(sass())
    .on('error', reportError)
    .pipe(gulp.dest('./public/css'))
    .pipe(connect.reload())

})

gulp.task('browserify', function() {
  return browserify('./app/app.js')
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public/js/'))
    .pipe(connect.reload())
})

gulp.task('html', function(){
  gulp.src("./public/*.html")
    .pipe(connect.reload())
})

gulp.task('compress', function(){
  gulp.src('./public/js/main.js')
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest('./public/js/'))

  gulp.src('./public/css/styles.css')
    .pipe(minify())
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest('./public/css/'))
})

gulp.task('watch', function () {
  gulp.watch(['./app/**/*.js'], ['browserify'])
  gulp.watch(['./app/**/*.scss'], ['sass'])
  gulp.watch(['./public/**/*.html'], ['html'])
  //gulp.watch(['./app/*.html'], ['html'])
})



gulp.task('default', ['connect', 'watch', 'browserify', 'sass']);

gulp.task('prod', ['browserify', 'sass', 'compress'])
