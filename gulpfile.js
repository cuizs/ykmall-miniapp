const gulp = require('gulp')
const less = require('gulp-less')
const sass = require('gulp-sass')(require('sass'))
const uglify = require('gulp-uglify')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const minifyCSS = require('gulp-minify-css')
const rename = require('gulp-rename')
const debug = require('gulp-debug')
const jade = require('gulp-jade')
const jsonMinify = require('gulp-jsonminify')
const changed = require('gulp-changed')

const paths = {
  dev: 'dist/dev',
  test: 'dist/test',
  prod: 'dist/prod',
}

let env = ''

function compileJs () {
  return gulp.src(['./src/**/*.js', '!./src/config/evnConfig.js', '!./src/config/evnConfig.**.js'], { since: gulp.lastRun(compileJs) }).pipe(changed(paths[env], { extension: '.js' })).pipe(debug({ title: 'compile:js==>  ' })).pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })).pipe(uglify()).pipe(rename({ extname: '.js' })).pipe(gulp.dest(paths[env]))
}

function compileLess () {
  return gulp.src(['./src/**/*.less'], { since: gulp.lastRun(compileLess) }).pipe(changed(paths[env], { extension: '.wxss' })).pipe(debug({ title: 'compile:less==>  ' })).pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })).pipe(less()).pipe(minifyCSS()).pipe(rename({ extname: '.wxss' })).pipe(gulp.dest(paths[env]))
}

function compileScss () {
  return gulp.src(['./src/**/*.scss'], { since: gulp.lastRun(compileScss) }).pipe(changed(paths[env], { extension: '.wxss' })).pipe(debug({ title: 'compile:scss==>  ' })).pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })).pipe(sass()).pipe(minifyCSS()).pipe(rename({ extname: '.wxss' })).pipe(gulp.dest(paths[env]))
}

function compileJade () {
  return gulp.src(['./src/**/*.jade'], { since: gulp.lastRun(compileJade) }).pipe(changed(paths[env], { extension: '.wxml' })).pipe(debug({ title: 'Compiling:jade ====> ' })).pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })).pipe(jade()).pipe(rename({ extname: '.wxml' })).pipe(gulp.dest(paths[env]))
}

function compileJson () {
  return gulp.src(['./src/**/*.json', '!./src/project.**.**.json', '!./src/project.**.json'], { since: gulp.lastRun(compileJson) }).pipe(changed(paths[env], { extension: '.json' })).pipe(debug({ title: 'Compiling:json ====> ' })).pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })).pipe(jsonMinify()).pipe(gulp.dest(paths[env]))
}

function copyFile () {
  return gulp.src(['./src/**/*.wxss', './src/**/*.wxml', './src/**/*.wxs'], { since: gulp.lastRun(copyFile) }).pipe(changed(paths[env])).pipe(gulp.dest(paths[env]))
}

function replaceProjectConfigJson () {
  if (env === 'dev') {
    return gulp.src([`./src/project.config.json`], { since: gulp.lastRun(replaceProjectConfigJson) }).pipe(changed(paths[env])).pipe(gulp.dest(paths[env]))
  } else {
    return gulp.src([`./src/project.config.${env}.json`], { since: gulp.lastRun(replaceProjectConfigJson) }).pipe(changed(paths[env])).pipe(rename({
      basename: 'project.config', extname: '.json',
    })).pipe(gulp.dest(paths[env]))
  }
}

function compileImage () {
  return new Promise(function (resolve, reject) {
    import('gulp-imagemin').then(gulpImagemin => {
      console.log('resolve', resolve)
      gulp.src(['src/**/*.{jpg,jpeg,png,gif}'], { since: gulp.lastRun(compileImage) }).pipe(changed(paths[env])).pipe(debug({ title: 'Compiling:img ====> ' })).pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })).pipe(
        gulpImagemin.default([
          gulpImagemin.mozjpeg({ progressive: true }),
          gulpImagemin.optipng(),
          gulpImagemin.gifsicle(),
          gulpImagemin.svgo()]),
      ).pipe(gulp.dest(paths[env]))
    })
  })
}

function replaceApiEnv () {
  if (env === 'dev') {
    return gulp.src([`./src/config/evnConfig.js`], { since: gulp.lastRun(replaceApiEnv) }).pipe(debug({ title: 'replace:env ====> ' })).pipe(changed(paths[env])).pipe(gulp.dest(paths[env] + '/config'))
  } else {
    return gulp.src([`./src/config/evnConfig.${env}.js`], { since: gulp.lastRun(replaceApiEnv) }).pipe(debug({ title: 'replace:env ====> ' })).pipe(changed(paths[env])).pipe(rename({
      basename: 'evnConfig', extname: '.js',
    })).pipe(gulp.dest(paths[env] + '/config'))
  }
}

function cleanUp () {

  return import('del').then(async del => {
    try {
      if(!env){
        del.deleteSync(['dist'])
        return
      }
      const result = await del.deleteAsync([`dist/${env}/*`, `!dist/${env}/miniprogram_npm`])
      return Promise.resolve(result)
    } catch (e) {
      console.error(e)
      return Promise.reject(e)
    }
  })
}

function compile () {
  cleanUp().then(res => {
    console.log(res)
    compileJs()
    compileLess()
    compileScss()
    compileJade()
    compileJson()
    copyFile()
    compileImage()
    replaceProjectConfigJson()
    replaceApiEnv()
  })
}

function watch (cb) {
  env = 'dev'
  compile()
  gulp.watch(['./src/**/*.js'], function (done) {
    compileJs()
    done()
  })
  gulp.watch(['./src/**/*.less'], function (done) {
    compileLess()
    done()
  })
  gulp.watch(['./src/**/*.scss'], function (done) {
    compileScss()
    done()
  })
  gulp.watch(['./src/**/*.json', '!./src/project.config.json'], function (done) {
    compileJson()
    done()
  })
  gulp.watch(['./src/**/*.jade'], function (done) {
    compileJade()
    done()
  })
  gulp.watch(['./src/**/*.wxss', './src/**/*.wxml', './src/**/*.wxs'], function (done) {
    copyFile()
    done()
  })
  gulp.watch(['src/**/*.{jpg,jpeg,png,gif}'], function (done) {
    compileImage()
    done()
  })
  gulp.watch(['./src/project.config.json', './src/project.config.**.json'], function (done) {
    replaceProjectConfigJson()
    done()
  })
  gulp.watch(['./src/config/envConfig.js', './src/config/envConfig.**.js'], function (done) {
    replaceApiEnv()
    done()
  })
}

function buildTest (done) {
  env = 'test'
  compile()
  done()
}

function buildProd (done) {
  env = 'prod'
  compile()
  done()
}

exports['dev'] = gulp.series(watch)
exports['build:test'] = gulp.series(buildTest)
exports['build:prod'] = gulp.series(buildProd)
exports['clean'] = gulp.series(cleanUp)


