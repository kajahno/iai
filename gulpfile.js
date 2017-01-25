var gulp = require('gulp');

var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssMin = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('copy-node-assets', function () {
  return gulp.src(['./node_modules/materialize-css/sass/**/*.scss','!./node_modules/materialize-css/sass/ghpages*','!./node_modules/materialize-css/sass/style.scss'])
    .pipe(gulp.dest('./dev/sass'));
});

gulp.task('copy-node-fonts', function () {
  return gulp.src('./dev/fonts/**/*')
    .pipe(gulp.dest('./prod/fonts'));
});


gulp.task('sass', function () {
  return gulp.src('./dev/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(concat('iai.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./prod/css'))
    .pipe(rename('iai.min.css'))
    .pipe(cssMin())
    .pipe(gulp.dest('./prod/css'));
});

gulp.task('js', function () {
  return gulp.src('./dev/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('iai.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./prod/js'))
    .pipe(rename('iai.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./prod/js'));
});

// start server and watch files for changes
gulp.task('watch', [ 'sass','browser-sync' ], function() {
    gulp.watch('./sass/**/*.scss', ['sass']);
    gulp.watch('./*.html').on('change', function() {
        browserSync.reload();
    });
});
