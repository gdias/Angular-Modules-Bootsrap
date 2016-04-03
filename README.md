
##Angular modules bootstrap

I have recently updated my way of work in web development, and i recently make an bootstrap for start instantly an FullJS project. Ideas, clone project on github, just code it !

This AngularJS bootstrap is oriented on modules of browserify, not the Angular's modules. This approach is a nice way for create an new clientside project with CommonJS modules. Also it's a good starting point for isomorphic coding.


Into this bootstrap you will find :
##### ServerSide
* Api server with JWT Auth routes [Express]
* Email templates helpers [Handlebars]
* Database with Mongoose [MongoDB]

##### ClientSide
* Development Server [Gulp]
* Sass styles Builder [SCSS]

## Features
- Angular 1.5.O
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
