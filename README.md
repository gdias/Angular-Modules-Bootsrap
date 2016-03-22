
##Angular modules bootstrap

I have recently updated my way of work in web development, and i has do a bootstrap for start an angular project instantly. One idea, checkout from github, code this idea !

This bootstrap is based on modules of browserify, not the Angular's modules.

It use Gulp for all front-end task (dev and production mode)

### Features
- Client Angular 1.5.O
- Server API ExpressJS
- Database MongoDB
- Json Web Token Authentication
- Module pattern with Browserify
- Use uglify for validate and compress JS code
- Sass builder (node-sass) and minifying
- Angular minifier mod

### Before start
Be sure to have an MongoDB server ready for use this bootstrap.
You can use this command for start mongoDB server

> mongod


##Usage

#### Start local server on port 8080
> gulp

#### Start production compression
> gulp prod
