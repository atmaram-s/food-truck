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
        bowerPath + '/angular-material/angular-material.js',
        bowerPath + '/angular-scroll/angular-scroll.min.js',
        bowerPath + '/ramda/dist/ramda.min.js',
        jsPath + '/app.js',
        jsPath + '/constants/constants.js',
        jsPath + '/factories/data-api.js',
        jsPath + '/factories/utils.js',
        jsPath + '/factories/locator.js',
        jsPath + '/directives/filter-group.js',
        jsPath + '/directives/truck-list.js',
        jsPath + '/directives/truck-detail.js',
        jsPath + '/directives/truck-map.js',
        jsPath + '/directives/loader.js'
    ]
};
