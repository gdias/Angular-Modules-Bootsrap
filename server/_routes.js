"use strict"

var express     = require('express')
  , router      = express.Router()
  , jwt         = require("jsonwebtoken")
  , expressJwt  = require("express-jwt")
  , fs          = require("fs")
  , db          = require("./database").db
  , User        = require("./models/user")
  , hash        = require('./utils').hash
  , validEmail  = require('./utils').validEmail
  , moment      = require('moment')
  , bcrypt      = require('bcrypt-nodejs')
  , nodemailer  = require('nodemailer')
  , handlebars  = require('handlebars')
  , key         = "ihaveanheartasallpeoplearoundme.yeah"



// middleware
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// API Routes
router.get('/', function(req, res) {
  res.json({api : 'API work !'})
})
/*
router.post('/auth', function(req, res) {

  var em = req.body.email
  var pw = req.body.pwd

  // check email
  User.find({email:em}, function (err, docs) {

      if(!!docs.length){
        var passCrypted = (docs[0].pass.length < 10 ? bcrypt.hashSync(docs[0].pass) : docs[0].pass)

        if(bcrypt.compareSync(pw, passCrypted)) {

          if (!!docs[0].active) {
            var token = jwt.sign({
                expiresIn : "7d"
              , username : req.body.email
            }, key)

            res.json(token)
          }
          else
            res.json({error:'Account not validated'})

        } else {
          res.json({error:'Bad password'})
        }
      } else {
        res.json({error:'Please, create an account'})
        // TODO : errorHandler
      }
  })

  router.get('/auth', expressJwt({secret:key}), function(req, res) {
    //console.log("/get >",req.body)
    res.sendStatus(200)
  })

})
*/
router.get('/test/email', function(req, res) {

  res.json({code:200})
})
/*
router.get('/users', function(req, res) {
  User.find({}, function (err, docs) {
      res.json(docs)
  })

  // console.log("--- generate hash ---");
  // hash.generate()
  // console.log("--- date ---");
  //var time =
  //console.log("time : ",time);
})
*/
router.post('/verify/email', function(req, res, email){
  if (!!req.body && !!req.body.email) {
    //console.log("email searched :: ",req.body.email);
    email = req.body.email

    User.find({"email" : email}, function (err, docs) {
      //console.log("response find : ", docs);
        res.json(docs)
    })
  }
})
/*
router.get('/user/authnewpass', expressJwt({secret:key}), function(req, res, hash) {

  console.log("data in token", req.user)
  hash = (!!req.user.hash ? req.user.hash : false)

  if (hash){
    // get informations user
    User.find({"hash": hash}, function(err, docs, user) {
      if (!!err) throw err

      if (!!docs) {
        user = docs[0]

        console.log("hash : ", hash);
        console.log("email >  : ", user.email);

        // get Hash and send new token
        token = jwt.sign({
            expiresIn : "1d"
          , email : user.email
          , hash : hash
        }, key)

        res.json({"token" : token})

      }

    })

  }



})
*/
/*
router.post('/user/renewpass', function(req, res, emailControlled, verif){

  verif = new validEmail

  if (!!req.body.email) {
    emailControlled = verif.control(req.body.email)

    if (!!emailControlled && !!req.body.step) {

            // generate a new token if email is correct
            User.find(
              {email : emailControlled}
            , function (err, docs, user, token, newH) {
                if (!!docs.length) {
                  user = docs[0]
                  if (!!user.active) {

                    // renew hash
                    newH = hash.generate()


                    User.update({"_id" : user._id}, {"hash" : newH}, function(err, stats){
                      if(!!err) throw(err)

                      if(!!stats.ok) {

                        token = jwt.sign({
                            expiresIn : "1d"
                          , email : user.email
                          , hash : newH
                        }, key)

                        res.json({"token" : token})

                        // http://localhost:8080/#renewPassword/valid/[TOKEN]

                        // send email with an new token with hash in link

                      }

                    })

                  } else
                    res.json({"error" : "Your acccount is not actived, you can't change the password"})

                } else
                  res.send(401)

              }
            )


    }
    else
      res.send(401)
  } else
    res.send(401)

})
*/
/*
router.post('/user', function(req, res) {

  var newHash = hash.generate()
  var verif = new validEmail
  var emailValid = verif.control(req.body.email)

  if(!emailValid)
    res.send(401)

  var passValid = req.body.pwd // TODO ; control password formats
  var passEncrypt = bcrypt.hashSync(passValid)

  var data = {
      email : emailValid
    , pass: passEncrypt
    , hash : newHash
    , startDate : moment().format()
    , active : 'false'
    , level : '1'
  }

  var user = new User(data)

  user.save(function (err) {
    if (err)
      res.json({error : err})

      // create a new token for validate account
    var token = jwt.sign({
        expiresIn : "2d"
      , hash : newHash
    }, key)

    var dataEmail = {
        email : emailValid
      , token : token
    }

    // TODO : Send token by email
    constructEmailValidateAccount(dataEmail)

    res.json({token : token})

  })
})


router.post('/user/validate', expressJwt({secret:key}), function(req, res) {

  if (!!req.user){
    var hash = req.user.hash
    var mail = req.user.email

    // find user
    User.find({email:mail}, function (err, docs, user) {
      if (!!docs.length) {
          user = docs[0]
        if (user.hash == hash && !user.active) {
          User.update({"hash":hash}, {"active" : true}, function(){
            res.json({msg : "Your account is validated now. You can log in our website"})
          })
        } else
          res.json({msg: "Your account have already actived"})
      }
      else
        res.json({msg : "You don't have an account. Be sure to have one for validate it."})
    })
  }
})
*/

router.get('/user/:user_id', function(req, res) {
  res.json({action:" GET one user"})
})


router.delete('/user/:user_id', function(req, res) {
  res.json({action:"DELETE one user"})
})


router.put('/user/:user_id', function(req, res) {
  res.json({action:" PUT update for one user"})
})


// middleware for auth (passport)
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next()

  res.redirect('/') // if unauthenticated
}

// construct Email : Validate account
function constructEmailValidateAccount(dataEmail) {

  loadtemplate("footer", __dirname + '/hbs/commons/footer.hbs')
  loadtemplate("header", __dirname + '/hbs/commons/header.hbs')
  loadtemplate("body", __dirname + '/hbs/email.hbs')

  fs.readFile(__dirname + '/hbs/body.hbs', 'utf8', function(err, data, model){
    if (err) throw err

    if (!!data){

      model = {
          header_text : "test Header text"
        , footer_text : "test Footer text"
        , title_tag : "Title of page"
      }

      var r = handlebars.compile(data)

      setTimeout(function(){
        var output = r(model)
        console.log("R output : ",output);
      },100)
    }

  })
}

function loadtemplate(name, path) {
  fs.readFile(path, 'utf8', function(err, data){
    if (err) throw err
    console.log("data[",name,"] : ", data)
    handlebars.registerPartial(name, data)
  })
}


module.exports = router
