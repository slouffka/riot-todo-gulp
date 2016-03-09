var _ = require('lodash')
  , st = require('st')
  , gulp = require('gulp')
  , jade = require('jade')
  , jshint = require('jshint')
  , cached = require('cached')
  , babel = require('gulp-babel')
  , gulpJade = require('gulp-jade')
  , stylus = require('gulp-stylus')
  , mocha = require('gulp-mocha')
  , riot = require('gulp-riot')
  , livereload = require('gulp-livereload')
  , http = require('http')
  , browserSync = require('browser-sync')
  , reload = browserSync.reload
  , optimize = require('amd-optimize')
  , concat = require('concat')
;

var jadePath = 'client/views/*.jade'
  , jsPath = 'client/index.js'
  , tagPath = 'client/tags/*.tag'
  , stylPath = 'client/styl/*.styl'
  , basePath = __dirname + '/client/public'
;

var path = {
    js: './client/js'
  , jade: './client/views/*.jade'
  , styl: './client/styl/*.styl'
  , base: __dirname + '/client/public'
};

gulp.task('test', function() {
  gulp.src('test/index.js', { read: false })
    .pipe(mocha({
      ui: 'bdd',
      bail: true,
      timeout: 2000,
      reporter: 'nyan'
    })
    .once('error', function(err) {
      console.log(err);
      process.exit();
    })
    .once('end', function() {
      process.exit();
    }));
});

gulp.task('jade', function() {
  gulp.src(jadePath)
    .pipe(gulpJade({ jade: jade, pretty: true }))
    .pipe(gulp.dest('client/public'))
    .pipe(livereload());
});

gulp.task('babel', function() {
  return gulp.src('client/main.js')
    .pipe(cached('scripts'))
    .pipe(babel())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(remember('scripts'))
    .pipe(optimize('main', {
      name: 'main',
      baseUrl: './client/js',
      configFile: './client/js/main.js',
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('client/public/js'));
});

gulp.task('tag', function() {
  gulp.src(tagPath)
    .pipe(riot())
    .pipe(gulp.dest('client/public/js'))
    .pipe(livereload());
});

gulp.task('styl', function() {
  gulp.src(stylPath)
    .pipe(stylus())
    .pipe(gulp.dest('client/public/css'))
    .pipe(livereload());
});

gulp.task('cook', ['babel', 'jade', 'tag', 'styl']);

gulp.task('watch', function() {
  livereload.listen();

  gulp.watch(jadePath, ['jade']);
  gulp.watch(tagPath, ['tag']);
  gulp.watch(stylPath, ['styl']);
});

gulp.task('sync', ['cook', 'watch'], function() {
  browserSync({
    server: { baseDir: 'client/public' }
  });

  gulp.watch(
    ['*.html', 'js/*.js', 'css/*.css'], { cwd: 'client/public' }, reload
  );
});

gulp.task('serve', ['cook', 'watch'], function(done) {
  var port = 3000;
  var mount = st({ path: basePath, index: 'index.html' })
  http.createServer(function(req, res) {
    mount(req, res, function() {
      res.end('this is not a static file')
    })
  }).listen(port, function(err) {
    if (err)
      return console.error('server crashed, error: ', err.message);

    console.log('server is running at port: %d', port);
  });
});

gulp.task('default', ['serve']);
