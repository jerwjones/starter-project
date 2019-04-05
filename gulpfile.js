var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css')
var concat = require('gulp-concat');
var del = require('del');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');

// Files to Copy
// Add all assets files here to be copied to dist
var copyFiles = [
    { src: '', dest: 'dist' },
];

// Clean Dist
// Delete the dist folder to start with a clean project
function clean() {
    return del(['dist']);
};

// Copy Assets
// Grab all files to copy and move to the dist folder
function copyAssets(done) {
    for (let i = 0, j = copyFiles.length; i < j; i++) {
        gulp.src(copyFiles[i].src)
            .pipe(gulp.dest(copyFiles[i].dest));
    }
    done();
};

// Copy HTML to dist
function html() {
    return gulp.src('src/**.html')
        .pipe(gulp.dest('./dist/'));
};

// Process SASS, minify, and copy to dist
function css() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/css'));
};

// Concat JS and copy to dist
function js() {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dist/scripts'))
};

// Automatically Reload BrowserSync change
function reload() {
    browserSync.reload();
};

// Initialize BrowserSync
function serve(done) {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    done();
}

// Watch all HTML, SASS, and JS files for changes and then reload BrowserSync
function watch() {
    gulp.watch('src/**.html', html).on('change', reload);
    gulp.watch('src/scss/**/*.scss', css).on('change', reload);
    gulp.watch('src/js/**/*.js', js).on('change', reload);
}

// Manually clean the dist folder
exports.clean = clean;

// Use "gulp" command to run all commands in series
var build = gulp.series(clean, copyAssets, html, css, js);
gulp.task('default', gulp.parallel(build, serve, watch));

