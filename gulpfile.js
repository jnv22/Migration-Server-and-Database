var gulp = require('gulp');
var server = require('gulp-express')

gulp.task('watch', function() {
  gulp.watch(['./*.js'], ['run'])
})

gulp.task('run', function() {
  server.run(['index.js'], [{livereload: 3000}]);
  gulp.watch(['./index.js'], [server.run])
})
