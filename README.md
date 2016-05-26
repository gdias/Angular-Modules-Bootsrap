
##Angular modules bootstrap

I changed my way of working in front-end development, and i recently make an bootstrap for start instantly an FullJS project. You have an website idea ? Clone project from github and just code it !

I wish that this AngularJS bootstrap is oriented on modules of browserify, not the Angular's modules. This approach is a nice way for create an new clientside project with CommonJS modules. Also it's a starting point for isomorphic coding.

##### Version
> 0.1.0

Into this bootstrap you will find :
##### ServerSide
* Api server with JWT Auth routes [Express]
* Email templates helpers [Handlebars]
* Database with Mongoose [MongoDB]

##### ClientSide
* Development Server with Watcher, Compiler and Notifications [Gulp]
* Sass styles Builder [SCSS]

## Features
- Node 6 Ready
- Angular 1.5
- Server API ExpressJS 4
- Database MongoDB
- Json Web Token Authentication
- Module pattern Browserify
- Account part ready (Sign up, Sign In, Password lost)
- Use uglify for validate and compress JS code
- Sass builder (node-sass) and minifying

## Bootstrap
- Basic routes Client (Home, About, Contact)
- Auth module with steps, sign-in, sign-out, forgot password and resend activation email
- API REST protected by JsonWebToken for authentication part

### Before start
Make sure to have an MongoDB server ready for use this bootstrap.
You can use this command for start mongoDB server
> mongod

For the tests E2E with Protractor, make sure you have Java installed and last versions of packages. The last version of NodeJs rewrite package arch, it's preferable to delete all nodes_modules in this case, and only after make
> npm install


##Usage

#### Start local server on port 8080
> gulp

#### Start production compression
> gulp prod

#### Start Angular E2e tests
> gulp tests

## Roadmap
- i18n for ML
- E2e & Units tests
- Account editor
- Admin manager
