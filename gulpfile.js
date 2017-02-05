'use strict';

var gulp = require('gulp');
var path = require('path');
var del = require('del');

var config = require('./gulp-config/config');
var filesToAdd = require('./gulp-config/paths');

var basePath = __dirname;
var buildPath = path.join(basePath, config.path.build);

var packages = {
    sync: require('gulp-sync')(gulp).sync,
    changed: require('gulp-changed'),
    concat: require('gulp-concat'),
    uglify: require('gulp-uglify'),
    minifyCSS: require('gulp-clean-css'),
    inject: require('gulp-inject'),
    sass: require('gulp-sass'),
    stripDebug: require('gulp-strip-debug')
};

function sassToCss(sourcePath, destPath) {
    return gulp.src(sourcePath + '/*.scss')
            .pipe(packages.sass().on('error', packages.sass.logError))
            .pipe(gulp.dest(destPath));
}

gulp.task('sass', function() {
    var sourcePath = path.join(basePath, config.path.scss);
    var destPath = path.join(basePath, config.path.css);

    return sassToCss(sourcePath, destPath);
});

gulp.task('sass:watch', function() {
    var sourcePath = path.join(basePath, config.path.scss);
    return gulp.watch(sourcePath + '/*.scss', packages.sync(['sass']));
});

gulp.task('inject-dev', function() {
  var target = gulp.src(basePath + '/index.html');
  var sourceFiles = gulp.src(filesToAdd.cssFiles.concat(filesToAdd.jsFiles), {read: false});

  return target.pipe(packages.inject(sourceFiles, { relative: true }))
         .pipe(gulp.dest(basePath));
})

gulp.task('dev', packages.sync([
                                'sass',
                                'inject-dev',
                                'sass:watch'
                            ])
                        );

gulp.task('clean', function() {
    return del([buildPath]);
});
