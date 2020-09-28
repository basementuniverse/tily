const gulp = require("gulp");
const concat = require("gulp-concat");
const wrap = require("gulp-wrap");
const jsmin = require("gulp-jsmin");

const paths = [
  "src/tily.js",
  "src/utility.js",
  "src/extends.js",
  "src/vec2.js",
  "src/main.js",
  "src/transition.js",
  "src/buffertransition.js",
  "src/offsettransition.js",
  "src/scaletransition.js",
  "src/bufferbase.js",
  "src/buffer.js",
  "src/cellbuffer.js",
  "src/cell.js",
  "src/tilelayer.js",
  "src/activetilebase.js",
  "src/activetile.js",
  "src/activetilelayer.js",
  "src/animation.js",
  "src/offsetanimation.js",
  "src/scaleanimation.js",
  "src/foregroundanimation.js",
  "src/opacityanimation.js",
  "src/rotationanimation.js",
  "src/textanimation.js",
  "src/outlineanimation.js",
  "src/shadowanimation.js"
];

function scripts() {
  const dev = process.env.DEV;
  const filename = dev ? "tily.dev.js" : "tily.min.js";
  let pipeline = gulp.src(paths)
    .pipe(concat(filename))
    .pipe(wrap({ src: "src/wrapper.js" }))
  if (!dev) {
    pipeline = pipeline.pipe(jsmin());
  }
  return pipeline.pipe(gulp.dest("."));
}

exports.default = gulp.series(scripts);
