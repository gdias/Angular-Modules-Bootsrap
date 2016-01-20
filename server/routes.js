"use strict"

module.exports = function(app, passport) {

    // homepage
    app.get('/', function(req, res) {
          res.render( 'template')
    })
/*
    app.get('/signin', function(req, res) {
          res.render('signin.hbs', { message: req.flash('signinMessage') })
    })

    app.get('/signup', function(req, res) {
          res.render('signup.hbs', { message: req.flash('signupMessage') })
    })

    app.get('/account', isLoggedIn, function(req, res) {
        res.render("account.hbs", {username : req.username})
    })
*/
    app.get("/logout", function(req, res){
      req.logout()
      res.redirect("/")
    })

}

function isLoggedIn(req, res, next) {

  if (req.isAuthenticated())
    return next()

  res.redirect('/') // if unauthenticated
}
