"use strict"

var express     = require('express')
  , User        = require("./models/user")
  , Hash        = require('./utils').hash
  , router      = express.Router()
  , User        = require("./models/user")
  , key         = "ihaveanheartasallpeoplearoundme.yeah"

module.exports.authnewpass = function(req, res, hash) {
  hash = (!!req.user.hash ? req.user.hash : false)
  if (hash){
    // get informations user
    User.find({"hash": hash}, function(err, docs, user, tokenJWT) {
      if (!!err) throw err
      if (!!docs) {
        user = docs[0]
        // get Hash and send new token
        tokenJWT = jwt.sign({
            expiresIn : "1d"
          , email : user.email
          , hash : hash
        }, key)

        res.json({"token" : tokenJWT})
      }
    })
  }
}

module.exports.renewpass = function(req, res, emailControlled, verif){

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
                    newH = Hash.generate()

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

}


module.exports.validate = function(req, res, hash, mail) {

  if (!!req.user) {
    hash = req.user.hash
    mail = req.user.email

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
}

module.exports.user = function(req, res, newHash, verif, emailValid, passValid, passEncrypt, data, user) {

  newHash = Hash.generate()
  verif = new validEmail
  emailValid = verif.control(req.body.email)

  if(!emailValid)
    res.send(401)

  passValid = req.body.pwd // TODO ; control password formats
  passEncrypt = bcrypt.hashSync(passValid)
  user = new User(data)
  data = {
      email : emailValid
    , pass: passEncrypt
    , hash : newHash
    , startDate : moment().format()
    , active : 'false'
    , level : '1'
  }

  user.save(function (err, tokenJWT, dataEmail) {

    if (err)
      res.json({error : err})

      // create a new token for validate account
    tokenJWT = jwt.sign({
        expiresIn : "2d"
      , hash : newHash
    }, key)

    dataEmail = {
        email : emailValid
      , token : tokenJWT
    }

    // TODO : Send token by email
    constructEmailValidateAccount(dataEmail)

    res.json({token : tokenJWT})

  })
}

//router.get('/authnewpass', expressJwt({secret:key}), )


//router.post('/renewpass', )


//router.post('/validate', expressJwt({secret:key}), )


//router.post('/', )
