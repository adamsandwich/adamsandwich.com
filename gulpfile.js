const fs = require('fs')
const path = require('path')
const fontmin = require('gulp-fontmin')
const gulp = require('gulp')

const SOURCE_PATH = 'public'

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
console.log(TEXT.length)

gulp.task('font-minify', function () {
  const sourceDir = path.join(__dirname, 'public/scripts/fonts/*.ttf')
  const backupDir = path.join(__dirname, 'public/scripts/fonts/.fontMinify')
  const destDir = path.join(__dirname, 'public/scripts/fonts')
  return gulp.src(sourceDir)
    .pipe(gulp.dest(backupDir))
    .pipe(fontmin({
      text: TEXT,
    }))
    .pipe(gulp.dest(destDir))
    .on('end', () => console.log('font-minify done!'))
})
