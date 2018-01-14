const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const babel = require('gulp-babel');


gulp.task('compile', () => {
  const stream = gulp.src(['*.js', '**/*.js', '!test.js']) // your ES2015 code
    .pipe(babel()) // compile new ones
    .pipe(gulp.dest('dist')); // write them
  return stream; // important for gulp-nodemon to wait for completion
});

gulp.task('watch', ['compile'], () => {
  const stream = nodemon({
	  script: 'dist/', // run ES5 code
	  watch: 'src', // watch ES2015 code
	  tasks: ['compile'], // compile synchronously onChange
  });

  return stream;
});
