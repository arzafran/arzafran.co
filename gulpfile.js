var postcss = require('gulp-postcss'),
 gulp = require('gulp'),
 browserSync = require('browser-sync').create(),
 autoprefixer = require('autoprefixer'),
 simplevars = require('postcss-simple-vars'),
 nested = require('postcss-nested'),
 cssnano = require('cssnano');

var paths = {
  css: 'precss/main.css',
  html: '**/*.html'
}

// Static server
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('css', function () {
    var processors = [
        nested(),
        simplevars(),
        autoprefixer({browsers: ['last 2 versions']}),
        cssnano()
    ];
    return gulp.src(paths.css)
        .pipe(postcss(processors))
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.reload({
          stream: true
        }));
});

// Rerun the task when a file changes
gulp.task('run', ['serve'], function() {
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.html, browserSync.reload({
    stream: true
  }));
});

// The default task (called when you run `gulp` from cli)
gulp.task('build', ['watch', 'scripts', 'images']);
