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
    minifyHtml: require('gulp-htmlmin'),
    minifySvg: require('gulp-svgmin'),
    inject: require('gulp-inject'),
    sass: require('gulp-sass'),
    stripDebug: require('gulp-strip-debug'),
    autoprefixer: require('gulp-autoprefixer')
};

function sassToCss(sourcePath, destPath) {
    return gulp.src(sourcePath + '/*.scss')
                .pipe(packages.sass().on('error', packages.sass.logError))
                .pipe(packages.autoprefixer({
                  browsers: ['last 5 versions'],
                  cascade: false
                }))
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
});

gulp.task('inject-prod', function() {
  var jsPath = path.join(buildPath, config.path.js);
  var cssPath = path.join(buildPath, config.path.css);

  var target = gulp.src(path.join(buildPath, '/index.html'));
  var sourceFiles = gulp.src([
      cssPath + '/**/*.css',
      jsPath + '/**/*.js',
  ], { read: false });

  return target.pipe(packages.inject(sourceFiles, { relative: true }))
                .pipe(packages.minifyHtml({collapseWhitespace: true}))
                .pipe(gulp.dest(buildPath));
});

gulp.task('copy-index', function() {
  return gulp.src(basePath + '/index.html')
              .pipe(packages.changed(buildPath))
              .pipe(gulp.dest(buildPath));
})

gulp.task('minify-html', function() {
  var sourcePath = path.join(basePath, config.path.html);
  var destPath = path.join(buildPath, config.path.html);

  return gulp.src(sourcePath + '/**/*.html')
              .pipe(packages.minifyHtml({collapseWhitespace: true}))
              .pipe(gulp.dest(destPath));
});

gulp.task('minify-svg', function() {
  var sourcePath = path.join(basePath, config.path.images);
  var destPath = path.join(buildPath, config.path.images);

  return gulp.src(sourcePath + '/**/*.svg')
              .pipe(packages.minifySvg())
              .pipe(gulp.dest(destPath));
});

gulp.task('minify-css', function() {
  var destPath = path.join(buildPath, config.path.css);

  return gulp.src(filesToAdd.cssFiles)
             .pipe(packages.concat("styles.css"))
             .pipe(packages.minifyCSS({compatibility: "ie8"}))
             .pipe(gulp.dest(destPath));
});

gulp.task('minify-js', function(cb) {
  var destPath = path.join(buildPath, config.path.js);

  return gulp.src(filesToAdd.jsFiles)
             .pipe(packages.concat("all.js"))
             .pipe(packages.stripDebug())
             .pipe(packages.uglify({
                 mangle: true,
                 preserveComments: "@license"
             }))
             .pipe(gulp.dest(destPath));
});

gulp.task('clean', function() {
    return del([buildPath]);
});

gulp.task('dev', packages.sync([
                                'sass',
                                'inject-dev',
                                'sass:watch'
                            ])
                        );

gulp.task('prod', packages.sync([
                                'clean',
                                'minify-html',
                                'minify-svg',
                                'sass',
                                'minify-css',
                                'minify-js',
                                'copy-index',
                                'inject-prod'
                            ])
                          );

gulp.task('default', ['dev']);
