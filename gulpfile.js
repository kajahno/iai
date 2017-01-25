var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssMin = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
var del = require('del');

// Run Static server & watch for file changes
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});
//copy assets from node_modules folder to dev
gulp.task('copy-node-assets', function () {
  return gulp.src(['./node_modules/materialize-css/sass/**/*.scss','!./node_modules/materialize-css/sass/ghpages*','!./node_modules/materialize-css/sass/style.scss'])
    .pipe(gulp.dest('./dev/sass'));
});
//copy fonts from dev to prod
gulp.task('copy-node-fonts', function () {
  return gulp.src('./dev/fonts/**/*')
    .pipe(gulp.dest('./prod/fonts'));
});
//sass task
gulp.task('sass', function () {
  return gulp.src('./dev/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(concat('iai.css'))
    .pipe(gulp.dest('./prod/css'))
    .pipe(rename('iai.min.css'))
    .pipe(cssMin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./prod/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});
//js task
gulp.task('js', function () {
  return gulp.src('./dev/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('iai.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./prod/js'))
    .pipe(rename('iai.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./prod/js'))
    .pipe(browserSync.reload({stream: true}))
});
//images task
gulp.task('images', () =>
    gulp.src('./dev/img/*.+(jpg|jpeg|png|gif)')
        .pipe(imagemin())
        .pipe(gulp.dest('./prod/img/'))
        .pipe(browserSync.reload({stream: true}))
);
//clean production folder before running build
gulp.task('clean:prod', function () {
  return del.sync([
    'prod/**/*'
    // '!prod/fonts/**/*'
  ]);
});
// start server and watch files for changes
gulp.task('watch', ['clean:prod','sass','js','images','copy-node-fonts','browser-sync'], function() {
    gulp.watch('./dev/sass/*.scss', ['sass']);
    gulp.watch('./dev/js/**/*.js', ['js']);
    gulp.watch('./dev/img/**/*.+(jpg|png|gif)', ['images']);
    gulp.watch('./*.html').on('change', function() {
        browserSync.reload();
    });
});
//default task when 'gulp' is called without parameters
gulp.task('default',['watch']);
