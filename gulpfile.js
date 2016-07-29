var gulp = require('gulp'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    inject = require('gulp-inject'),
    cssmin = require('gulp-cssmin'),
    mainBowerFiles = require('main-bower-files');


gulp.task('default', ['inject:dependencies', 'connect', 'watch']);

gulp.task('connect', function () {
    connect.server({
        root: ['app', '.'],
        livereload: true
    });
});

gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./app/assets/css'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src('./app/**/*.html')
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src('./app/assets/js/**/*.js')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
    gulp.watch(['./app/assets/js/**/*.js'], ['js']);
    gulp.watch(['./app/**/*.html'], ['html']);
});

gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./app/assets/css'))
        .pipe(connect.reload());
});

gulp.task('inject:dependencies', ['sass'], function () {
    return gulp.src('./app/**/*.html')
        .pipe(inject(gulp.src(mainBowerFiles('**/*.js', { read: false })), { name: 'bower', addRootSlash: false }))
        .pipe(inject(gulp.src(mainBowerFiles('**/*.css', { read: false })), { name: 'bower', addRootSlash: false }))
        .pipe(inject(gulp.src('./app/assets/css/*.css', { read: false }), { name: 'site', ignorePath: 'app', addRootSlash: false }))
        .pipe(inject(gulp.src('./app/assets/js/**/*.js', { read: false }), { name: 'site', ignorePath: 'app', addRootSlash: false }))
        .pipe(gulp.dest('./app'));
});

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean())
});

gulp.task('build', ['clean', 'sass'], function () {
    var time = new Date().getTime();
    return gulp.src('./app/index.html')
        .pipe(inject(
            gulp.src(mainBowerFiles('**/*.js'))
                .pipe(uglify())
                .pipe(concat('vendor.' + time + '.js'))
                .pipe(gulp.dest('./dist/assets/js')),
            { name: 'bower', ignorePath: 'dist', addRootSlash: false }
        ))
        .pipe(inject(
            gulp.src(mainBowerFiles('**/*.css'))
                .pipe(concat('vendor.' + time + '.css'))
                .pipe(gulp.dest('./dist/assets/css')),
            { name: 'bower', ignorePath: 'dist', addRootSlash: false }
        ))
        .pipe(inject(
            gulp.src('./app/assets/css/*.css')
                .pipe(cssmin())
                .pipe(concat('site.' + time + '.css'))
                .pipe(gulp.dest('./dist/assets/css')),
            { name: 'site', ignorePath: 'dist', addRootSlash: false }
        ))
        .pipe(inject(
            gulp.src('./app/assets/js/*.js')
                .pipe(uglify())
                .pipe(concat('site.' + time + '.js'))
                .pipe(gulp.dest('./dist/assets/js')),
            { name: 'site', ignorePath: 'dist', addRootSlash: false }
        ))
        .pipe(gulp.dest('./dist'));
});