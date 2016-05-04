
##Angular modules bootstrap

I changed my way of working in front-end development, and i recently make an bootstrap for start instantly an FullJS project. You have an website idea ? Clone project from github and just code it !

This AngularJS bootstrap is oriented on modules of browserify, not the Angular's modules. This approach is a nice way for create an new clientside project with CommonJS modules. Also it's a starting point for isomorphic coding.

##### Version
> 0.1.0

Into this bootstrap you will find :
##### ServerSide
* Api server with JWT Auth routes [Express]
* Email templates helpers [Handlebars]
* Database with Mongoose [MongoDB]

##### ClientSide
* Development Server with Watcher, Compiler and notifications [Gulp]
* Sass styles Builder [SCSS]

## Features
- Angular 1.5.O
- Server API ExpressJS
- Database MongoDB
- Json Web Token Authentication
- Module pattern Browserify
- Account part ready (Create, Sign In, Retrieve password)
- Use uglify for validate and compress JS code
- Sass builder (node-sass) and minifying



### Before start
Be sure to have an MongoDB server ready for use this bootstrap.
You can use this command for start mongoDB server
> mongod


##Usage

#### Start local server on port 8080
> gulp

#### Start production compression
> gulp prod


## Roadmap
- Add i18n for ML
- Add Unit Test with other Gulp process
- Add account editor for users
- Add account manager for admin
