// Require Gulp
var gulp = require('gulp'),
  // Require Gulp-sass plugin
  sass = require('gulp-sass'),
  // Sass globbing import for LibSass
  globbing = require('gulp-css-globbing'),
  // Require Gulp-bower to install dependencies
  bower = require('gulp-bower'),
  // Require Sourcemaps
  sourcemaps = require('gulp-sourcemaps'),
  // Require Browser Sync for livereloading
  browserSync = require('browser-sync').create(),
  // Require Process HTML
  processHtml = require('gulp-processhtml'),
  // Require PostCSS
  postcss = require('gulp-postcss'),
  // Require PostCSS autoprefixer
  autoprefixer = require('autoprefixer'),
  // Require postCSS clean
  cleanCSS = require('gulp-clean-css'),
  // Require Css-MQpacker// Clean CSS
  mqpacker = require('css-mqpacker'),
  // Image optimization plugin
  imagemin = require('gulp-imagemin'),
  // Concat plugin
  concat = require('gulp-concat'),
  // uglify plugin
  uglify = require('gulp-uglify');

// Project settings
var config = {
  base: {
    css: 'css/',
    js: 'js/',
    images: 'img/',
    html: './'
  },
  folderAssets: {
    base: 'assets',
    styles: 'assets/styles',
    images: 'assets/img',
    js: 'assets/js'
  },
  folderBower: {
    base: 'bower_components',
    normalize: 'bower_components/normalize-scss',
    jquery: 'bower_components/jquery-latest'
  },
  postCSS: {
    processors: [
      autoprefixer({
        browsers: [
          // 'Android >= 2.3',
          // 'BlackBerry >= 7',
          // 'Chrome >= 9',
          // 'Firefox >= 4',
          // 'Explorer >= 9',
          // 'iOS >= 5',
          // 'Opera >= 11',
          // 'Safari >= 5',
          // 'OperaMobile >= 11',
          // 'OperaMini >= 6',
          // 'ChromeAndroid >= 9',
          // 'FirefoxAndroid >= 4',
          // 'ExplorerMobile >= 9',
          'last 2 versions',
          '> 1%',
          'last 3 iOS versions',
          'Firefox > 20',
          'ie 9'
        ]
      }),
      mqpacker()
    ]
  }
};

// Sass tasks are divided for performance issues regarding dependencies
// Sass Build task definition, only ran once
gulp.task('sass:build', ['bowercopy'], function() {
  return gulp.src(config.folderAssets.styles + '/styles.scss')
    .pipe(globbing({
      // Configure it to use SCSS files
      extensions: ['.scss']
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: ['assets/styles/'] }).on('error', sass.logError))
    .pipe(postcss(config.postCSS.processors))
    .pipe(cleanCSS({ advanced: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.base.css))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Sass Watch task definition
gulp.task('sass', function() {
  return gulp.src(config.folderAssets.styles + '/styles.scss')
    .pipe(globbing({
      // Configure it to use SCSS files
      extensions: ['.scss']
    }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(config.postCSS.processors))
    .pipe(cleanCSS({ advanced: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.base.css))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Browser Sync task definition
gulp.task('serve', ['build'], function() {
  return browserSync.init({
    port: 1337,
    server: {
      baseDir: config.base.html
    },
    ui: {
      port: 1338
    }
  });
});

// Process HTML task definition
gulp.task('processHtml', function() {
  return gulp.src(config.folderAssets.base + '/templates/*.html')
    .pipe(processHtml({
      recursive: true,
      environment: 'dev'
    }))
    .pipe(gulp.dest(config.base.html))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Run bower update
gulp.task('bower', function() {
  return bower({
    cmd: 'update'
  });
});

// Copy only the needed resources from Bower
gulp.task('bowercopy', ['bowercopy:normalize', 'bowercopy:jquery']);

gulp.task('bowercopy:normalize', ['bower'], function() {
  return gulp.src([config.folderBower.normalize + '/*.scss'])
    .pipe(gulp.dest(config.folderAssets.styles + '/libs/normalize'));
});
gulp.task('bowercopy:jquery', ['bower'], function() {
  return gulp.src([config.folderBower.jquery + '/dist/jquery.min.js'])
    .pipe(gulp.dest(config.base.js + '/vendor'));
});

// Optimize JS
gulp.task('optimize:js', function() {
  return gulp.src([config.folderAssets.js + '/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js', {
      newLine: ';'
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.base.js));
});

// Optimize Images
gulp.task('optimize:images', function() {
  return gulp.src([config.folderAssets.images + '/**/*'])
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      svgoPlugins: [{ removeViewBox: true }]
    }))
    .pipe(gulp.dest(config.base.images));
});

// Watch for changes
gulp.task('run', ['serve'], function() {
  gulp.watch(config.folderAssets.base + '/**/*.scss', ['sass']);
  gulp.watch(config.folderAssets.images + '/*.*', ['optimize:images']);
  gulp.watch(config.folderAssets.js + '/*', ['optimize:js']);
  gulp.watch(config.folderAssets.base + '/templates/*.html', ['processHtml']);
  gulp.watch(config.base.js + '/*.js').on('change', browserSync.reload);
});

// Define build task
gulp.task('build', ['sass:build', 'optimize:js', 'processHtml', 'optimize:images']);