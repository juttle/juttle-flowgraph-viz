var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var babelify = require('babelify');
var connect = require('gulp-connect');

gulp.task('browserify', function() {
    return browserify('src/index.js', {
        entries: ['src/index.js'],
        debug: true
    })
        .transform(babelify, { presets: ["react", "es2015"] })
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./dist/'));
});

gulp.task('styles', function() {
    gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', ['browserify', 'styles'], function() {
    gulp.watch(['src/**/*.js'], ['browserify']);
    gulp.watch(['src/**/*.scss'], ['styles']);
});

gulp.task('run', ['watch'], function() {
    connect.server({
        port: 8888,
        root: ['examples', 'dist']
    });
});

gulp.task('build', ['browserify', 'styles']);
