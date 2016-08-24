var gulp        = require("gulp");
var browserSync = require("browser-sync");
var cp          = require("child_process");
var sass		= require("gulp-sass");

var paths = {
	css: {
		src: "./app/assets/_src/css/**/*.scss",
		dist: "./app/assets/css/",
		jekyllSrv: "./_site/css/"
	},
	html: {
		src: "./app/assets/**/*.html"
	},
	jekyll: {
		src: "./_site/"
	},
	js: {
		src: "./app/assets/_src/js/**/*.js",
		dist: "./app/assets/js/",
		jekyllSrv: "./_site/js/"
	},
	md: {
		src: "./app/assets/**/*.md"
	}
}

gulp.task(jekyllBuild);
gulp.task(jekyllServe);
gulp.task(css);
gulp.task(js);
gulp.task(reload);
gulp.task(watch);
gulp.task("default",
	gulp.series(jekyllBuild, css, js, gulp.parallel(jekyllServe, watch))
)

function jekyllBuild(done) {
	return cp.spawn("jekyll.bat", ["build"], {stdio: "inherit"}).on("close", done);
}

function jekyllServe() {
	browserSync.init({
		server: paths.jekyll.src
	});
}

function css() {
	return gulp.src(paths.css.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(paths.css.jekyllSrv))
		.pipe(gulp.dest(paths.css.dist))
        .pipe(browserSync.stream());
}

function js() {
	return gulp.src(paths.js.src)
		.pipe(gulp.dest(paths.js.jekyllSrv))
		.pipe(gulp.dest(paths.js.dist))
        .pipe(browserSync.stream());
}

function reload() {
	browserSync.reload();
}

function watch() {
	gulp.watch(paths.html.src).on("change", gulp.series(jekyllBuild, reload));
	gulp.watch(paths.md.src).on("change", gulp.series(jekyllBuild, reload));
	gulp.watch(paths.css.src).on("change", css);
	gulp.watch(paths.js.src).on("change", js);
}
