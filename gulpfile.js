let fileswatch = 'pug,html,htm,txt,json,md,eot,ttf,woff,woof2,svg' // List of files extensions for watching & hard reload

const { src, dest, parallel, series, watch } = require('gulp')
const browserSync  = require('browser-sync').create()
const webpack      = require('webpack-stream')
const pug          = require('gulp-pug')
const sass         = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const rename       = require('gulp-rename')
const imagemin     = require('gulp-imagemin')
const newer        = require('gulp-newer')
const rsync        = require('gulp-rsync')
const del          = require('del')

const wp = true

const path = wp ? '../assets' : 'app'

function browsersync() {
  browserSync.init({
    server: { baseDir: 'app/' },
    notify: false,
    online: true
  })
}

function pages() {
  return src('app/pug/*.pug')
  .pipe(pug({ pretty: true }))
  .on('error', function (err) {
    process.stderr.write(err.message + '\n')
    this.emit('end')
  })
  .pipe(dest('app'))
  .pipe(browserSync.reload({ stream: true }))
}

function scripts() {
  return src('app/js/app.js')
  .pipe(webpack({
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/env']
          }
        }
      ]
    }
  })).on('error', function handleError() {
    this.emit('end')
  })
  .pipe(rename('app.min.js'))
  .pipe(dest('../assets/js'))
  // 
  .pipe(browserSync.stream())
}

function styles() {
  return src('app/sass/main.sass')
  .pipe(sass({ outputStyle: 'expanded' }))
  .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
  .pipe(rename('app.css'))
  .pipe(dest(`${path}/css`))
  // 
  .pipe(sass({ outputStyle: 'compressed' }))
  .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
  .pipe(rename('app.min.css'))
  .pipe(dest(`${path}/css`))
  // 
  .pipe(browserSync.stream())
}

function images() {
  return src('app/img/**/*')
  .pipe(newer(`${path}/img`))
  .pipe(imagemin())
  .pipe(dest(`${path}/img`))
}

function cleanimg() {
  return del(`${path}/img/**/*`, { force: true })
}

function deploy() {
  return src('../')
  .pipe(rsync({
    root: '../',
    hostname: 'username@yousite.com',
    destination: 'yousite/public_html/',
    include: [/* '*.htaccess' */], // Included files to deploy,
    exclude: [ '**/Thumbs.db', '**/*.DS_Store', 'gulp/' ],
    recursive: true,
    archive: true,
    silent: false,
    compress: true
  }))
}

function startwatch() {
  watch('app/pug/**/*.pug', { usePolling: true }, pages)
  watch('app/sass/**/*', { usePolling: true }, styles)
  watch(['app/js/**/*.js', '!app/js/**/*.min.js'], { usePolling: true }, scripts)
  watch('app/img/**/*.{jpg,jpeg,png,webp,svg,gif}', { usePolling: true }, images)
  watch(`app/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browserSync.reload)
}

exports.assets   = series(cleanimg, scripts, images)
exports.pages    = pages
exports.scripts  = scripts
exports.styles   = styles
exports.images   = images
exports.cleanimg = cleanimg
exports.deploy   = deploy
exports.default  = series(pages, scripts, images, styles, parallel(browsersync, startwatch))
