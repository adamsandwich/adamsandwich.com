const fs = require('fs')
const path = require('path')
const fontmin = require('@adamsandwich/gulp-fontmin')
const htmlmin = require('gulp-htmlmin')
const rev = require('gulp-rev')
const revRewrite = require('gulp-rev-rewrite')
const gulp = require('gulp')
const log = require('fancy-log')
const del = require('del')
const SOURCE_PATH = 'static'

const readDirRecursively = (filePath, judge) => {
  let pathArray = [filePath]
  let spiderPaths = []
  while (pathArray.length !== 0) {
    const pathName = pathArray.shift()
    const files = fs.readdirSync(pathName)
    files.forEach((fileName) => {
      const fileDir = path.join(pathName, fileName)
      const fsStats = fs.statSync(fileDir)
      if (fsStats.isFile() && judge(fileDir)) {
        spiderPaths.push(fileDir)
      }
      if (fsStats.isDirectory()) {
        pathArray.push(fileDir)
      }
    })
  }
  return spiderPaths
}

const isNeededExt = (fileName) => {
  const exts = [
    '.html',
    '.js',
    '.css',
  ]
  return exts.includes(path.extname(fileName))
}

const FONT_PATHS = readDirRecursively(SOURCE_PATH, isNeededExt)

const readString = (pathNames) => {
  let stringSet = new Set()
  pathNames.forEach((pathName) => {
    const string = fs.readFileSync(pathName, 'utf8')
    for (let i = 0; i < string.length; i++) {
      if (!stringSet.has(string.charAt(i))) {
        stringSet.add(string.charAt(i))
      }
    }
  })
  return [...stringSet].join(' ')
}

const TEXT = readString(FONT_PATHS)
log(`${TEXT.length} unique character`)

gulp.task('font-minify', () => {
  const sourceTtfDir = path.join(__dirname, `${SOURCE_PATH}/*.ttf`)
  const destDir = path.join(__dirname, `${SOURCE_PATH}/`)
  return gulp.src([sourceTtfDir])
    // .pipe(gulp.dest(backupDir))
    .pipe(fontmin({
      text: TEXT,
    }))
    .pipe(gulp.dest(destDir))
})

gulp.task('clean-font-cache', () => {
  return del([
    `${SOURCE_PATH}/sarasa-mono-sc-regular.ttf`,
    `${SOURCE_PATH}/sarasa-mono-sc-regular.woff2`,
  ]);
})

gulp.task('assets-hash', () => {
  const sourceDir = path.join(__dirname, `${SOURCE_PATH}/`)
  return gulp.src(`${sourceDir}/**/*.{css,js}`)
    .pipe(gulp.dest(sourceDir))
    .pipe(rev())
    .pipe(gulp.dest(sourceDir))
    .pipe(rev.manifest('assets-rev.json'))
    .pipe(gulp.dest(sourceDir))
})

gulp.task('html-hash', () => {
  const sourceDir = path.join(__dirname, `${SOURCE_PATH}/`)
  const assetsManifest = gulp.src(`${sourceDir}/assets-rev.json`)
  return gulp.src(`${SOURCE_PATH}/**/*.html`)
    .pipe(revRewrite({ manifest: assetsManifest }))
    .pipe(gulp.dest(SOURCE_PATH))
})


gulp.task('html-minify', () => {
  return gulp.src(`${SOURCE_PATH}/**/*.html`)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(SOURCE_PATH))
});

gulp.task('default', gulp.series('assets-hash', 'html-minify'));
gulp.task('font', gulp.series('font-minify'));
