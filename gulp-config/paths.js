'use strict';

var path = require('path');
var basePath = __dirname + '/..';
var appPath = basePath + '/src';

var bowerPath = basePath + '/bower_components';
var cssPath = basePath + '/assets/css';
var jsPath = appPath + '/scripts'

module.exports = {
  cssFiles: [
    bowerPath + '/angular-material/angular-material.min.css',
    cssPath + '/styles.css',
    cssPath + '/responsive.css'
  ],
  jsFiles: [
    bowerPath + '/angular/angular.js',
    bowerPath + '/angular-route/angular-route.min.js',
    bowerPath + '/angular-animate/angular-animate.min.js',
    bowerPath + '/angular-aria/angular-aria.min.js',
    bowerPath + '/angular-messages/angular-messages.min.js',
    bowerPath + '/angular-material/angular-material.min.js',
    jsPath + '/app.js',
    jsPath + '/controllers/home.js'
  ],
};
