'use strict';

var gulp = require('gulp')
  , jade = require('jade')
  , gulpJade = require('gulp-jade')
  , less = require('gulp-less')
  , riot = require('gulp-riot')
  // , livereload = require('gulp-livereload')
  , http = require('http')
  , st = require('st')
  , browserSync = require('browser-sync')
  , reload = browserSync.reload
;

var jadePath = 'client/src/views/*.jade'
  , tagPath = 'client/src/tags/*.tag'
  , lessPath = 'client/src/less/*.less'
  , basePath = __dirname + '/client/public'
;

gulp.task('jade', function() {
    var YOUR_LOCALS = {
        jade: jade,
        pretty: true
    };

    gulp.src(jadePath)
        .pipe(gulpJade(YOUR_LOCALS))
        .pipe(gulp.dest('client/public'));
        // .pipe(livereload())
});

gulp.task('tag', function() {
    gulp.src(tagPath)
        .pipe(riot())
        .pipe(gulp.dest('client/public/js'));
        // .pipe(livereload())
});

gulp.task('less', function() {
    gulp.src(lessPath)
        .pipe(less())
        .pipe(gulp.dest('client/public/css'));
        // .pipe(livereload())
});

gulp.task('watch', function() {
    // livereload.listen();

    gulp.watch(jadePath, ['jade']);
    gulp.watch(tagPath, ['tag']);
    gulp.watch(lessPath, ['less']);
});

gulp.task('sync', function() {
    browserSync({
        server: {
            baseDir: 'client/public'
        }
    });

    gulp.watch(['*.html', 'js/*.js', 'css/*.css'], { cwd: 'client/public' }, reload);
});

gulp.task('serve', function(done) {
    var port = 3000;
    var mount = st({ path: __dirname + '/client/public', index: 'index.html' })
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

gulp.task('default', ['jade', 'tag', 'less', 'watch', 'sync'], function() {
    // place code for default task here
});
