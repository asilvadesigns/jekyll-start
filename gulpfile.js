//
//  https://github.com/shakyShane/jekyll-gulp-sass-browser-sync
//
//
//  Required Plugins
var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync'),
    cssnano      = require('gulp-cssnano'),
    childProcess = require('child_process'),
    plumber      = require('gulp-plumber'),
    sass         = require('gulp-sass');

//
//  Messages
var messages     = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

//
//  Jekyll Build
gulp.task('jekyll-build', function(done) {
    browserSync.notify(messages.jekyllBuild);
    return childProcess.spawn('jekyll.bat', [ 'build', '--source=' + 'app', '--destination=' + '_site', '--config=' + '_config.yml', '--profile' ], {stdio: 'inherit'}).on('close', done);
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
//  SASS Compile
gulp.task('sass', function() {
    gulp.src('app/_sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers:  ['last 2 versions'],
            cascade:   false
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('app/_includes'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//
//  Watch
gulp.task('watch', function () {
    gulp.watch('app/_sass/**/*.scss', ['sass']);
    gulp.watch(['app/*.html', 'app/js/*.js', 'app/_layouts/*.html', 'app/_posts/*', 'app/_includes/*.html', 'app/_includes/*.css'], ['jekyll-rebuild']);
});

//
//  Default
gulp.task('default', ['browser-sync', 'watch']);
