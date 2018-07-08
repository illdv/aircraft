const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer');
const minify = require('gulp-csso')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp');
const rename = require('gulp-rename')
const htmlclean = require('gulp-htmlclean');
const jsmin = require('gulp-jsmin');
const server = require('browser-sync').create();
const del = require('del');
const svgo = require('gulp-svgo');



gulp.task('styles', function () {
  return gulp
    .src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(minify())
    // .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream())
});







gulp.task('minHtml', function () {
  return gulp.src('source/*.html')
    .pipe(htmlclean({
      protect: /<\!--%fooTemplate\b.*?%-->/g,
      edit: function (html) {
        return html.replace(/\begg(s?)\b/ig, 'omelet$1');
      }
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('jsmin', function () {
  return gulp.src('source/script/*.js')
    .pipe(jsmin())
    .pipe(gulp.dest('build/script'));

});

gulp.task('serve', function () {
  server.init({
    server: 'build/',
  });
  gulp.watch('source/sass/**/*.{scss,sass}', gulp.parallel('styles'));
  gulp.watch('source/*.html', gulp.parallel('minHtml'))
    .on('change', server.reload);
  gulp.watch('source/script/*.js', gulp.parallel('jsmin'))
    .on('change', server.reload);
});


gulp.task('copy', function () {
  return gulp.src([
      'source/fonts/*',
      'source/images/**',
      'source/script/**',
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('build'));
})
gulp.task('clean', function () {
  return del('build');
})
gulp.task('build', gulp.series('clean', 'minHtml', 'copy', 'styles'));






gulp.task('images', function () {
  return gulp.src('source/images/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest('source/images'))
})

// gulp.tast('webp', function () {
//   return gulp.src('source/img/**/*.{png,jpg}')
//     .pipe(webp({
//       quality: 90
//     }))
//     .pipe(gulp.dest('source/img'));
// })