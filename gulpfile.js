//Library
const gulp = require("gulp"),
      pug = require("gulp-pug"),
      plumber = require('gulp-plumber'),
      notify  = require('gulp-notify'),
      changed  = require('gulp-changed'),
      webpack = require("webpack"),
      webpackStream = require("webpack-stream"),
      sass = require("gulp-sass"),
      postcss = require("gulp-postcss"),
      mqpacker = require("css-mqpacker"),
      autoprefixer = require("autoprefixer"),
      gapProperties = require("postcss-gap-properties"),
      declarationSorter = require("css-declaration-sorter"),
      sassGlob = require("gulp-sass-glob"),
      cds = require("postcss-combine-duplicated-selectors"),
      cssnano = require("cssnano"),
      sourcemaps = require("gulp-sourcemaps"),
      browserSync = require('browser-sync'),
      imagemin = require('gulp-imagemin'),
      pngquant = require('imagemin-pngquant'),
      mozjpeg = require('imagemin-mozjpeg'),
      gifsicle = require('imagemin-gifsicle'),
      svgo = require('imagemin-svgo')

//Directory
const dist_dir = "./dist",
      src_dir = "./src"

//Webpack Config
const webpackConfig = require("./webpack.config")

gulp.task("sass", () =>{

  const postcss_plugin = [
    cds(),
    mqpacker(),
    gapProperties(),
    declarationSorter({
      order: 'smacss'
    })
  ]

  return (
    gulp.src(src_dir+"/**/!(_)*.+(sa|sc|c)ss",{
      sourcemaps: true
    })
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(sassGlob())
    .pipe(
      sass({
        outputStyle: "expanded"
      }).on("error", sass.logError)
    )
    .pipe(postcss(postcss_plugin))
    .pipe(postcss([
      autoprefixer({
        browsers: ["IE 10", "last 2 versions" ],
        grid: true
      })
    ]))
    .pipe(postcss([cssnano({autoprefixer: false})]))
    .pipe(gulp.dest(dist_dir,{sourcemaps: "./" }))
    .pipe(browserSync.reload({stream:true}))
  )

})

gulp.task("pug", () =>{

  return (
    gulp.src(src_dir+"/**/!(_)*.pug")
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(dist_dir))
    .pipe(browserSync.reload({stream:true}))
  )

})

gulp.task("image", () =>{

  return (
    gulp.src(src_dir+"/**/*.+(jpg|jpeg|png|gif|svg)")
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(changed(dist_dir))
    .pipe(imagemin(
      [
        pngquant({
          quality:[.75,.85],
          speed: 1,
          floyd: 0,
        }),
        mozjpeg({
          quality: 80,
          progressive: true
        }),
        svgo(),
        gifsicle(),
        imagemin.optipng(),
      ],
      {
        verbose: true
      }
    ))
    //.pipe(imagemin())
    .pipe(gulp.dest(dist_dir))
    .pipe(browserSync.reload({stream:true}))
  )

})

gulp.task("webpack", () => {

  return (
    webpackStream(webpackConfig, webpack)
    .on("error", (e) => {
        this.emit("end");
    })
  )
  .pipe(browserSync.reload({stream:true}))

})

gulp.task("sync", () => {

  browserSync({
      server: {
        baseDir: dist_dir,
      }
  })

})


gulp.task("watch", () => {

  gulp.watch(src_dir+"/**/*.+(sa|sc|c)ss", gulp.task("sass"))
  gulp.watch(src_dir+"/**/*.pug", gulp.task("pug"))
  gulp.watch(src_dir+"/**/*.+(jpg|jpeg|png|gif|svg)", gulp.task("image"))
  gulp.watch(src_dir+"/**/*.js", gulp.task("webpack"))

})

gulp.task("default", gulp.series(gulp.parallel("pug", "sass", "webpack", "image", "sync", "watch"))) 