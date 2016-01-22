var browserify = require('browserify');
var through2 = require('through2');
var source = require('vinyl-source-stream');

module.exports = function(gulp, plugins, settings) {
  return function() {
    gulp.task('scripts', () => {
      return browserify({entries: settings.paths.source + 'scripts/javascript.jsx', extensions: ['.jsx'], debug: false})
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(settings.paths.output + '/scripts/'))
        .pipe(plugins.browserSync.stream());
    });
  }
};
