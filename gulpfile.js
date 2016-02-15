'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sweetjs = require('gulp-sweetjs')
const shell = require('gulp-shell')
const mocha = require('gulp-mocha')

gulp.task('build', () => {
  gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(sweetjs({
      modules: ['contracts-js/macros', 'lambda-jam/macro'],
      readtables: []
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'))
})

gulp.task('buildTest', () => {
  gulp.src('test/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(sweetjs({
      modules: ['contracts-js/macros', 'lambda-jam/macro', 'sweet-bdd'],
      readtables: []
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('test-build'))
})


gulp.task('test', ['build', 'buildTest'], () => {
  gulp.src('test-build/test.js')
      .pipe(mocha());
})
