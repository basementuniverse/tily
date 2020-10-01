const { src, dest, series } = require('gulp');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const wrap = require('gulp-wrap');
const terser = require('gulp-terser');
const clean = require('gulp-clean');
const rename = require('gulp-rename');

// Input files
const paths = [
  'src/tily.js',
  'src/utility.js',
  'src/extends.js',
  'src/vec2.js',
  'src/main.js',
  'src/transition.js',
  'src/buffertransition.js',
  'src/offsettransition.js',
  'src/scaletransition.js',
  'src/bufferbase.js',
  'src/buffer.js',
  'src/cellbuffer.js',
  'src/cell.js',
  'src/tilelayer.js',
  'src/activetilebase.js',
  'src/activetile.js',
  'src/activetilelayer.js',
  'src/animation.js',
  'src/offsetanimation.js',
  'src/scaleanimation.js',
  'src/foregroundanimation.js',
  'src/opacityanimation.js',
  'src/rotationanimation.js',
  'src/textanimation.js',
  'src/outlineanimation.js',
  'src/shadowanimation.js'
];

// Output file
const outFile = 'tily.js';

// Cleanup
function clear() {
  return src([
    'animals.dev.js',
    'animals.min.js'
  ], {
    read: false
  }).pipe(clean());
}

// Build
function build() {
  const dev = process.env.DEV === 'true';
  return src(paths)
    .pipe(concat(outFile))
    .pipe(wrap({ src: 'src/wrapper.js' }))
    .pipe(gulpif(!dev, terser()))
    .pipe(rename({ extname: dev ? '.dev.js' : '.min.js' }))
    .pipe(dest('.'));
}

exports.default = series(build);
