"use strict"

var routes = require("./base")


module.exports.authRoutes = (function() {

  // Sign in
  routes.add("/signin", {
      templateUrl: 'partials/auth/signin.html'
    , controller: 'signinController'
  })

  // Sign up : Step 1
  routes.add("/signup", {
      templateUrl: 'partials/auth/signup.html'
    , controller: 'signupController'
  })

  // sign up ok : Step 2
  routes.add("/signup/valid", {
      templateUrl: 'partials/auth/signup_valid.html'
  })

  // Sign up validate : Step 3
  routes.add("/validateAccount/:token", {
      templateUrl: 'partials/auth/validateAccount.html'
  })

  // Renew password routes
  routes.add("/renewPassword/start", {
      templateUrl: 'partials/auth/renew_start.html'
    , controller: 'renewControllerStart'
  })

  routes.add("/renewPassword/form", {
      templateUrl: 'partials/auth/renew_form.html'
    , controller: 'renewController'
  })

  routes.add("/renewPassword/validForm", {
      templateUrl: 'partials/auth/renew_validForm.html'
  })

  routes.add("/renewPassword/validNotActive", {
      templateUrl: 'partials/auth/renew_validNotActive.html'
  })

  routes.add("/renewPassword/valid/:token", {
      templateUrl: 'partials/auth/renew_valid.html'
    , controller: 'renewValidController'
  })

  routes.add("/renewPassword/validChangeOk", {
    templateUrl: 'partials/auth/renew_validOk.html'
  })

  return routes
})()
