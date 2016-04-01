//
//  Helpful Resources:
//  https://github.com/shakyShane/jekyll-gulp-sass-browser-sync
//  http://blog.webbb.be/use-jekyll-with-gulp/
//
//
//  Required Plugins
var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync'),
    cssnano      = require('gulp-cssnano'),
    childProcess = require('child_process'),
    plumber      = require('gulp-plumber'),
    sass         = require('gulp-sass'),
    sassdoc      = require('sassdoc');

//
//  Messages
var messages     = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

//
//  Jekyll Build
gulp.task('jekyll-build', function(done) {
    browserSync.notify(messages.jekyllBuild);
    return childProcess.spawn('jekyll.bat', ['build', '--profile'], {stdio: 'inherit'})
        .on('close', done);
});

//
//  Jekyll Rebuild
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
    browserSync.reload();
});

//
//  Jekyll Serve
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync.init({
        server: '_site',
        notify: true
    });
});

//
//  Sass Compile
gulp.task('sass', function() {
    gulp.src('./_sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers:  ['last 2 versions'],
            cascade:   false
        }))
        .pipe(cssnano({
            discardComments: { removeAll: true }
        }))
        .pipe(gulp.dest('./_includes'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//
//  Sass Docs
gulp.task('sassdoc', function() {
    gulp.src('./_sass/**/*.scss')
        .pipe(sassdoc({
            dest: './_docs',
        }))
});

//
//  Watch
gulp.task('watch', function () {
    gulp.watch('./_sass/**/*.scss', ['sass']);
    gulp.watch(['./_includes/*', './_layouts/*', './_pages/*', './_posts/*', './_projects/*'], ['jekyll-rebuild']);
});

//
//  Production
gulp.task('production', ['sass', 'sassdoc', 'jekyll-build']);

//
//  Default
gulp.task('default', ['browser-sync', 'watch']);
